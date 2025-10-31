interface Ctx { requestId?: string; duration?: number; ip?: string; error?: string; stack?: string; [k:string]: any }
type Level = 'info'|'warn'|'error'|'debug';

class Logger {
  private sample(level: Level){ if(level==='error'||level==='warn')return true; return process.env.NODE_ENV==='production'?Math.random()<0.05:true }
  private out(level: Level, message: string, ctx: Ctx = {}) {
    if(!this.sample(level)) return;
    const entry = {
      '@ts': new Date().toISOString(),
      level, message,
      service: 'crset-agi',
      env: process.env.NODE_ENV || 'dev',
      rev: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,7) || 'local',
      ...ctx
    };
    if(entry.stack && level!=='error') delete entry.stack;
    console.log(JSON.stringify(entry));
  }
  info(m:string,c?:Ctx){ this.out('info',m,c) }
  warn(m:string,c?:Ctx){ this.out('warn',m,c) }
  error(m:string,c?:Ctx){ this.out('error',m,c) }
  debug(m:string,c?:Ctx){ this.out('debug',m,c) }
}
export const logger = new Logger();
