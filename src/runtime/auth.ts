import type { CamundaConfig } from './unifiedConfiguration';
import type { Logger } from './logger';
import type { TelemetryHooks, TelemetryAuthStartEvent, TelemetryAuthSuccessEvent, TelemetryAuthErrorEvent } from './telemetry';


/** Auth error codes */
export enum CamundaAuthErrorCode {
	TOKEN_FETCH_FAILED = 'TOKEN_FETCH_FAILED',
	TOKEN_PARSE_FAILED = 'TOKEN_PARSE_FAILED',
	TOKEN_EXPIRED = 'TOKEN_EXPIRED',
	TOKEN_REFRESH_CONFLICT = 'TOKEN_REFRESH_CONFLICT',
	OAUTH_CONFIG_MISSING = 'OAUTH_CONFIG_MISSING',
	BASIC_CREDENTIALS_MISSING = 'BASIC_CREDENTIALS_MISSING',
	MTLS_CONFIG_MISSING = 'MTLS_CONFIG_MISSING',
	MTLS_LOAD_FAILED = 'MTLS_LOAD_FAILED'
}

export class CamundaAuthError extends Error {
	constructor(public code: CamundaAuthErrorCode, message: string, public cause?: any) {
		super(`${code}: ${message}`);
		this.name = 'CamundaAuthError';
	}
}

export interface AuthTokenCacheEntry {
	access_token: string;
	token_type?: string;
	scope?: string;
	expires_at_epoch_ms: number; // real expiry (provider exp - skew buffer)
	obtained_at_epoch_ms: number; // when fetched
	oauth_url: string;
	client_id?: string;
	audience?: string;
}

type HeadersHook = (headers: Record<string,string>) => Promise<Record<string,string>> | Record<string,string>;

/** Internal singleflight & state */
class OAuthManager {
	private refreshing: Promise<string>|null = null;
	private token: AuthTokenCacheEntry | null = null;
	private readonly storageKey: string;
	private readonly isBrowser = typeof window !== 'undefined';
	private readonly session: Storage | null;
	constructor(private cfg: CamundaConfig, private logger: Logger, private tHooks?: TelemetryHooks, private correlationProvider?: () => string | undefined) {
		const hashBase = `${cfg.oauth.oauthUrl}|${cfg.oauth.clientId||''}|${cfg.tokenAudience}|${cfg.oauth.scope||''}`;
		this.storageKey = 'camunda_oauth_token_cache_' + this.simpleHash(hashBase);
		this.session = this.isBrowser && typeof window.sessionStorage !== 'undefined' ? window.sessionStorage : null;
		// Load disk cache (Node) or session cache (browser)
		this.loadPersisted();
	}
	private simpleHash(s: string): string { let h=0; for (let i=0;i<s.length;i++) { h = (Math.imul(31,h)+s.charCodeAt(i))|0; } return (h>>>0).toString(16); }
	private log(...args:any[]) { this.logger.debug(...args); }
	private now() { return Date.now(); }
	private loadPersisted() {
		if (this.session) {
			try { const raw = this.session.getItem(this.storageKey); if (raw) { this.token = JSON.parse(raw); } } catch {/* ignore */}
		}
		if (!this.session && this.cfg.oauth.cacheDir && this.isNode()) {
			try { const fs = require('fs'); const path = require('path'); const file = path.join(this.cfg.oauth.cacheDir, this.storageKey + '.json'); if (fs.existsSync(file)) { const raw = fs.readFileSync(file,'utf8'); this.token = JSON.parse(raw); } } catch {/* ignore */}
		}
	}
	private persist() {
		if (this.token) {
			if (this.session) {
				try { this.session.setItem(this.storageKey, JSON.stringify(this.token)); } catch {/* ignore */}
			} else if (this.cfg.oauth.cacheDir && this.isNode()) {
				try { const fs = require('fs'); const path = require('path'); if (!fs.existsSync(this.cfg.oauth.cacheDir)) fs.mkdirSync(this.cfg.oauth.cacheDir,{recursive:true}); const file = path.join(this.cfg.oauth.cacheDir, this.storageKey + '.json'); const tmp = file + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(this.token), { mode:0o600 }); fs.renameSync(tmp,file); } catch {/* ignore */}
			}
		}
	}
	private isNode() { return typeof process !== 'undefined' && !!process.versions?.node; }
	private effectiveExpiry(t: AuthTokenCacheEntry) { return t.expires_at_epoch_ms; }
	private shouldRefresh(t: AuthTokenCacheEntry) {
		const now = this.now();
		if (now < t.obtained_at_epoch_ms - 30000) { // clock jumped backwards
			this.log('Clock skew backwards detected; invalidating token');
			return true;
		}
		const refreshLead = 5000; // 5s lead
		return now >= (this.effectiveExpiry(t) - refreshLead);
	}
	async getToken(fetcher: (input: RequestInfo, init?: RequestInit) => Promise<Response>): Promise<string> {
		if (this.token && !this.shouldRefresh(this.token)) return this.token.access_token;
		if (this.refreshing) {
			try { return await this.refreshing; } catch (e) {
				if (this.token && !this.shouldRefresh(this.token)) return this.token.access_token; // keep old until expiry
				throw e;
			}
		}
		this.refreshing = this.fetchAndStore(fetcher).finally(()=> { this.refreshing = null; });
		return this.refreshing;
	}
	async forceRefresh(fetcher: (input: RequestInfo, init?: RequestInit) => Promise<Response>): Promise<string> { this.refreshing = this.fetchAndStore(fetcher).finally(()=> { this.refreshing=null; }); return this.refreshing; }
	clearCache(opts:{disk?:boolean;memory?:boolean}={disk:true,memory:true}) { if (opts.memory) this.token=null; if (opts.disk) { if (this.session) { this.session.removeItem(this.storageKey); } else if (this.cfg.oauth.cacheDir && this.isNode()) { try { const fs=require('fs'); const path=require('path'); const file=path.join(this.cfg.oauth.cacheDir,this.storageKey+'.json'); if (fs.existsSync(file)) fs.unlinkSync(file);} catch {/*ignore*/} } } }
	private async fetchAndStore(fetcher:(input:RequestInfo,init?:RequestInit)=>Promise<Response>): Promise<string> {
		if (!this.cfg.oauth.clientId || !this.cfg.oauth.clientSecret) throw new CamundaAuthError(CamundaAuthErrorCode.OAUTH_CONFIG_MISSING,'Missing OAuth client credentials');
		const body = new URLSearchParams();
		body.set('grant_type', this.cfg.oauth.grantType || 'client_credentials');
		body.set('client_id', this.cfg.oauth.clientId);
		body.set('client_secret', this.cfg.oauth.clientSecret);
		body.set('audience', this.cfg.tokenAudience);
		if (this.cfg.oauth.scope) body.set('scope', this.cfg.oauth.scope);
		const max = this.cfg.oauth.retry.max || 5;
		const base = this.cfg.oauth.retry.baseDelayMs || 1000;
		let attempt = 0; let lastErr: any;
		while (attempt < max) {
			const controller = new AbortController();
			const timeout = setTimeout(()=> controller.abort(), this.cfg.oauth.timeoutMs);
			try {
				if (attempt === 0) {
					const evt: TelemetryAuthStartEvent = { type:'auth.start', ts: Date.now(), audience: this.cfg.tokenAudience, endpoint: this.cfg.oauth.oauthUrl, cache: !!this.token, correlationId: this.correlationProvider?.() };
					try { this.tHooks?.authStart?.(evt); } catch {/* ignore */}
				}
				this.logger.debug(`OAuth token attempt ${attempt+1}/${max}`);
				const res = await fetcher(this.cfg.oauth.oauthUrl, { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body: body.toString(), signal: controller.signal });
				clearTimeout(timeout);
				if (!res.ok) { lastErr = new Error(`HTTP ${res.status}`); throw lastErr; }
				const json: any = await res.json();
				if (!json.access_token || !json.expires_in) throw new CamundaAuthError(CamundaAuthErrorCode.TOKEN_PARSE_FAILED,'Missing access_token or expires_in in response');
				const now = this.now();
				const lifetimeMs = json.expires_in * 1000;
				const skewBuffer = Math.max(30000, Math.floor(lifetimeMs * 0.05));
				const entry: AuthTokenCacheEntry = {
					access_token: json.access_token,
					token_type: json.token_type,
						scope: json.scope,
					obtained_at_epoch_ms: now,
					expires_at_epoch_ms: now + lifetimeMs - skewBuffer,
					oauth_url: this.cfg.oauth.oauthUrl,
					client_id: this.cfg.oauth.clientId,
					audience: this.cfg.tokenAudience
				};
				this.token = entry; this.persist();
				this.logger.info('Token fetched; effective expiry (s)=', Math.round((entry.expires_at_epoch_ms - now)/1000));
				try {
					const evt: TelemetryAuthSuccessEvent = { type:'auth.success', ts: Date.now(), audience: this.cfg.tokenAudience, endpoint: this.cfg.oauth.oauthUrl, cached: false, durationMs: Date.now()-now, expiresInSec: Math.round((entry.expires_at_epoch_ms - now)/1000), scopes: entry.scope? String(entry.scope).split(/\s+/): undefined, correlationId: this.correlationProvider?.() };
					this.tHooks?.authSuccess?.(evt);
				} catch {/* ignore */}
				return entry.access_token;
			} catch (e:any) {
				clearTimeout(timeout);
				lastErr = e;
				attempt++;
				if (attempt >= max) break;
				const delay = base * Math.pow(2, attempt-1);
				const jitter = delay * 0.2 * (Math.random()-0.5); // +/-20%
				const sleep = delay + jitter;
				try {
					// Emit retry event (domain auth) with computed next delay
					this.tHooks?.retry?.({ type:'retry', ts: Date.now(), attempt, nextDelayMs: Math.round(sleep), reason: lastErr?.message||'error', domain:'auth', correlationId: this.correlationProvider?.() });
				} catch {/* ignore */}
				await new Promise(r=> setTimeout(r, sleep));
			}
		}
		try {
			const evt: TelemetryAuthErrorEvent = { type:'auth.error', ts: Date.now(), audience: this.cfg.tokenAudience, endpoint: this.cfg.oauth.oauthUrl, durationMs: 0, status: lastErr?.message?.match(/HTTP (\d+)/)?.[1] ? parseInt(RegExp.$1,10) : undefined, message: lastErr?.message||String(lastErr), correlationId: this.correlationProvider?.() };
			this.tHooks?.authError?.(evt);
		} catch {/* ignore */}
		throw new CamundaAuthError(CamundaAuthErrorCode.TOKEN_FETCH_FAILED, `Failed to fetch token after ${max} attempts: ${lastErr?.message||lastErr}` , lastErr);
	}
}

class BasicAuthManager {
	private token: string;
	constructor(private cfg: CamundaConfig) {
		const u = cfg.auth.basic?.username?.trim();
		const p = cfg.auth.basic?.password?.trim();
		if (!u || !p) throw new CamundaAuthError(CamundaAuthErrorCode.BASIC_CREDENTIALS_MISSING,'Missing basic auth username or password');
		if (typeof Buffer !== 'undefined') {
			this.token = Buffer.from(`${u}:${p}`).toString('base64');
		} else {
			// browser fallback
			this.token = btoa(`${u}:${p}`);
		}
	}
	getHeader() { return `Basic ${this.token}`; }
}

export interface AuthFacade {
	getAuthHeaders(): Promise<Record<string,string>>;
	forceRefresh(): Promise<string|undefined>;
	clearCache(opts?:{disk?:boolean;memory?:boolean}): void;
	registerHeadersHook(h: HeadersHook): void;
	/** test-only helper */
	debug__setTokenExpiry?(epochMs: number): void;
}

export function createAuthFacade(config: CamundaConfig, opts?: { fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>; logger?: Logger; telemetryHooks?: TelemetryHooks; correlationProvider?: () => string | undefined }): AuthFacade {
	const cfg = config;
	const noop: Logger = {
		level: () => 'silent', setLevel: ()=>{}, setTransport: ()=>{},
		error: ()=>{}, warn: ()=>{}, info: ()=>{}, debug: ()=>{}, trace: ()=>{}, code: ()=>{},
		scope: () => noop
	} as any;
	const authLogger = (opts?.logger || noop).scope('auth');
	const tHooks = opts?.telemetryHooks;
	const hooks: HeadersHook[] = [];
	let oauth: OAuthManager | null = null;
	let basic: BasicAuthManager | null = null;
	if (cfg.auth.strategy === 'OAUTH') oauth = new OAuthManager(cfg, authLogger.scope('oauth'), tHooks, opts?.correlationProvider);
	else if (cfg.auth.strategy === 'BASIC') basic = new BasicAuthManager(cfg);
	const fetcher = (input: RequestInfo, init?: RequestInit) => opts?.fetch ? opts.fetch(input, init) : fetch(input, init);
		// mTLS: if in Node and mtls config present, create https.Agent and augment fetch with agent option.
		let nodeAgent: any = null;
		if (cfg.mtls && typeof process !== 'undefined' && process.versions?.node) {
			try {
				const fs = require('fs');
				const https = require('https');
				const material: any = {};
				if (cfg.mtls.cert || cfg.mtls.certPath) material.cert = cfg.mtls.cert || fs.readFileSync(cfg.mtls.certPath, 'utf8');
				if (cfg.mtls.key || cfg.mtls.keyPath) material.key = cfg.mtls.key || fs.readFileSync(cfg.mtls.keyPath, 'utf8');
				if (cfg.mtls.ca || cfg.mtls.caPath) material.ca = cfg.mtls.ca || fs.readFileSync(cfg.mtls.caPath, 'utf8');
				if (cfg.mtls.keyPassphrase) material.passphrase = cfg.mtls.keyPassphrase;
				nodeAgent = new https.Agent(material);
				// Expose for request layer reuse without import cycles.
				try { (globalThis as any).__CAMUNDA_MTLS_AGENT = nodeAgent; } catch {}
			} catch (e) {
				authLogger.warn('Failed to create mTLS agent – proceeding without mTLS', (e as any)?.message || e);
			}
		}
		const withAgent = async (input: RequestInfo, init?: RequestInit) => {
			if (nodeAgent) {
				// @ts-ignore Node fetch agent injection
				return fetcher(input, { ...(init||{}), agent: nodeAgent });
			}
			return fetcher(input, init);
		};
	return {
		async getAuthHeaders() {
			const h: Record<string,string> = {};
				if (oauth) h['Authorization'] = 'Bearer ' + await oauth.getToken(withAgent);
			else if (basic) h['Authorization'] = basic.getHeader();
			let acc = h;
			for (const hook of hooks) { acc = await hook(acc); }
			return acc;
		},
			async forceRefresh() { if (oauth) return oauth.forceRefresh(withAgent); return undefined; },
		clearCache(opts) { if (oauth) oauth.clearCache(opts); },
		registerHeadersHook(h) { hooks.push(h); },
		debug__setTokenExpiry(epochMs: number) { if (oauth && oauth['token']) { (oauth as any).token.expires_at_epoch_ms = epochMs; } }
	};
}
// (No default singleton export; auth is instance-scoped via Camunda constructor.)

