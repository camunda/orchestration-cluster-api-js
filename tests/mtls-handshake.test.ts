/**
 * mTLS must reach the wire (issue #540).
 *
 * These tests do a real TLS handshake against a local HTTPS server that requires a
 * client certificate signed by a test CA, and whose own certificate is signed by the
 * same (non-system) CA. A request only succeeds if the SDK both trusts the custom CA
 * and presents the client certificate.
 *
 * The suite covers every HTTP path the SDK makes, not just one: generated API
 * operations and the OAuth token request. Any new transport path that bypasses the
 * mTLS configuration should be added here.
 *
 * Fixtures: tests/fixtures/mtls (test-only, self-signed; see README there).
 */
import fs from 'node:fs';
import https from 'node:https';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import type { TLSSocket } from 'node:tls';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createCamundaClient } from '../src';

const FIX = path.join(__dirname, 'fixtures', 'mtls');
const read = (f: string) => fs.readFileSync(path.join(FIX, f), 'utf8');

const LICENSE = { validLicense: true, licenseType: 'test', isCommercial: false, expiresAt: null };

let server: https.Server;
let base: string;
/** Client-certificate CNs the server saw, per request path. */
const seen: Array<{ path: string; cn: string | undefined }> = [];

beforeAll(async () => {
  server = https.createServer(
    {
      cert: read('server.pem'),
      key: read('server.key'),
      ca: read('ca.pem'),
      requestCert: true,
      rejectUnauthorized: true,
    },
    (req, res) => {
      const peer = (req.socket as TLSSocket).getPeerCertificate();
      const cn = peer?.subject?.CN;
      seen.push({ path: req.url || '', cn: Array.isArray(cn) ? cn[0] : cn });
      res.setHeader('Content-Type', 'application/json');
      if (req.url?.startsWith('/oauth/token')) {
        res.end(JSON.stringify({ access_token: 'tok', expires_in: 3600, token_type: 'Bearer' }));
        return;
      }
      res.end(JSON.stringify(LICENSE));
    }
  );
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
  base = `https://localhost:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((r) => server.close(() => r()));
});

const mtlsInline = () => ({
  CAMUNDA_MTLS_CERT: read('client.pem'),
  CAMUNDA_MTLS_KEY: read('client.key'),
  CAMUNDA_MTLS_CA: read('ca.pem'),
});

const mtlsPaths = () => ({
  CAMUNDA_MTLS_CERT_PATH: path.join(FIX, 'client.pem'),
  CAMUNDA_MTLS_KEY_PATH: path.join(FIX, 'client.key'),
  CAMUNDA_MTLS_CA_PATH: path.join(FIX, 'ca.pem'),
});

describe('mTLS handshake (real TLS)', () => {
  it.each([
    ['inline PEM', mtlsInline],
    ['PEM paths', mtlsPaths],
  ])('API operations present the client cert and trust the custom CA (%s)', async (_, mtls) => {
    seen.length = 0;
    const camunda = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: base,
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        ...mtls(),
      },
    });
    const license = await camunda.getLicense();
    expect(license.validLicense).toBe(true);
    expect(seen.at(-1)?.cn).toBe('sdk-test-client');
  });

  it('the OAuth token request presents the client cert and trusts the custom CA', async () => {
    seen.length = 0;
    const camunda = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: base,
        CAMUNDA_AUTH_STRATEGY: 'OAUTH',
        CAMUNDA_OAUTH_URL: `${base}/oauth/token`,
        CAMUNDA_CLIENT_ID: 'id',
        CAMUNDA_CLIENT_SECRET: 'secret',
        CAMUNDA_OAUTH_RETRY_MAX: 1,
        ...mtlsInline(),
      },
    });
    await camunda.getLicense();
    const token = seen.find((s) => s.path.startsWith('/oauth/token'));
    expect(token?.cn).toBe('sdk-test-client');
    expect(seen.at(-1)?.cn).toBe('sdk-test-client');
  });

  it('CA-only config trusts the server but is rejected without a client cert (control: the server really enforces mTLS)', async () => {
    seen.length = 0;
    const camunda = createCamundaClient({
      config: {
        CAMUNDA_REST_ADDRESS: base,
        CAMUNDA_AUTH_STRATEGY: 'NONE',
        CAMUNDA_MTLS_CA: read('ca.pem'),
      },
    });
    const err: any = await camunda.getLicense().then(
      () => null,
      (e) => e
    );
    expect(err).toBeTruthy();
    // Failure must come from the missing client cert, not from an untrusted server cert.
    expect(
      JSON.stringify(err, Object.getOwnPropertyNames(err)) + String(err?.cause?.cause)
    ).not.toMatch(/SELF_SIGNED|self-signed|UNABLE_TO_VERIFY/);
    expect(seen).toHaveLength(0);
  });
});
