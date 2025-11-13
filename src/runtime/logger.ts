// Per-client logger (no global singleton). Construct via createLogger.

// Added 'silly' for deep diagnostics (unsafe: logs HTTP bodies when enabled elsewhere)
export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silly';
export interface LogEvent {
  level: LogLevel;
  scope: string;
  ts: number;
  args: any[];
  code?: string;
  data?: any;
}
export type LogTransport = (e: LogEvent) => void;
const ORDER: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
  silly: 6,
};

export interface Logger {
  level(): LogLevel;
  setLevel(level: LogLevel): void; // internal use
  setTransport(t?: LogTransport): void; // internal use
  error(...a: any[]): void;
  warn(...a: any[]): void;
  info(...a: any[]): void;
  debug(...a: any[]): void;
  trace(...a: any[]): void;
  silly(...a: any[]): void;
  scope(child: string): Logger;
  code(level: LogLevel, code: string, msg: string, data?: any): void;
}

export interface CreateLoggerOptions {
  level?: LogLevel;
  transport?: LogTransport;
  scope?: string;
}

export function createLogger(opts: CreateLoggerOptions = {}): Logger {
  let currentLevel: LogLevel = opts.level || 'error';
  let transport: LogTransport | undefined = opts.transport;
  const baseScope = opts.scope || '';

  function isEnabled(need: LogLevel) {
    return ORDER[currentLevel] >= ORDER[need];
  }
  function evalArgs(args: any[]): any[] {
    // Support lazy function args: if an arg is a function with zero arity, call it.
    return args.map((a) => (typeof a === 'function' && a.length === 0 ? a() : a)).flat();
  }
  function emit(level: LogLevel, scope: string, rawArgs: any[]) {
    if (!isEnabled(level)) return;
    const args = evalArgs(rawArgs);
    const evt: LogEvent = { level, scope, ts: Date.now(), args };
    if (transport) {
      try {
        transport(evt);
      } catch {
        /* ignore transport errors */
      }
    } else {
      const tag = `[camunda-sdk][${level}]${scope ? `[${scope}]` : ''}`;
      const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      // eslint-disable-next-line no-console
      console[method](tag, ...args);
    }
  }
  function emitCode(level: LogLevel, scope: string, code: string, msg: string, data?: any) {
    if (!isEnabled(level)) return;
    const evt: LogEvent = { level, scope, ts: Date.now(), args: [msg], code, data };
    if (transport) {
      try {
        transport(evt);
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      const tag = `[camunda-sdk][${level}]${scope ? `[${scope}]` : ''}`;
      const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      // eslint-disable-next-line no-console
      console[method](tag, code + ':', msg, data ?? '');
    }
  }
  const make = (scope: string): Logger => ({
    level: () => currentLevel,
    setLevel(l: LogLevel) {
      currentLevel = l;
    },
    setTransport(t?: LogTransport) {
      transport = t;
    },
    error: (...a: any[]) => emit('error', scope, a),
    warn: (...a: any[]) => emit('warn', scope, a),
    info: (...a: any[]) => emit('info', scope, a),
    debug: (...a: any[]) => emit('debug', scope, a),
    trace: (...a: any[]) => emit('trace', scope, a),
    silly: (...a: any[]) => emit('silly', scope, a),
    scope(child: string) {
      return make(scope ? `${scope}:${child}` : child);
    },
    code(l: LogLevel, code: string, msg: string, data?: any) {
      emitCode(l, scope, code, msg, data);
    },
  });
  return make(baseScope);
}
