// src/libs/cache.ts
import { Telegraf, Context } from "telegraf";

type Entry = {
  key: string;
  bot: Telegraf<Context>;
  exp: number;
};

class BotCache {
  private map = new Map<string, Entry>();

  constructor(
    private capacity: number = 200, // máximo de bots “quentes”
    private ttlMs: number = 10 * 60_000, // 10 min
  ) {}

  get(key: string): Telegraf<Context> | null {
    const e = this.map.get(key);
    if (!e) return null;
    if (e.exp < Date.now()) {
      // expirado
      this.map.delete(key);
      try {
        e.bot.stop();
      } catch {}
      return null;
    }
    // move para o fim (mais recente)
    this.map.delete(key);
    e.exp = Date.now() + this.ttlMs;
    this.map.set(key, e);
    return e.bot;
  }

  set(key: string, bot: Telegraf<Context>): void {
    // atualiza/move se já existir
    if (this.map.has(key)) this.map.delete(key);
    const e: Entry = { key, bot, exp: Date.now() + this.ttlMs };
    this.map.set(key, e);

    // Evicção LRU (segura para TS): pegue o primeiro item se exceder capacidade
    if (this.map.size > this.capacity) {
      const iter = this.map.keys();
      const first = iter.next(); // { value?: string, done: boolean }
      if (!first.done) {
        const oldestKey = first.value as string;
        const oldest = this.map.get(oldestKey);
        if (oldest) {
          try {
            oldest.bot.stop();
          } catch {}
        }
        this.map.delete(oldestKey);
      }
    }
  }

  delete(key: string): void {
    const e = this.map.get(key);
    if (e) {
      try {
        e.bot.stop();
      } catch {}
      this.map.delete(key);
    }
  }

  clear(): void {
    for (const [, e] of this.map) {
      try {
        e.bot.stop();
      } catch {}
    }
    this.map.clear();
  }
}

export default BotCache;
