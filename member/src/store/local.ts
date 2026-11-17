import type { PrivateInfo, Profile, Store, Tally, VoteRecord } from "./types";
import { today } from "./types";

/**
 * 端末内（localStorage）に保存するお試し用の保存先。
 * Firebase の設定がないときに使う。記録はこのブラウザの中だけで、他の人とは共有されない。
 */
const KEY = "the12.local.v2";

interface Db {
  users: Record<string, Profile & { priv: PrivateInfo }>;
  votes: Record<string, VoteRecord[]>;
  tally: Tally;
}

const empty = (): Db => ({ users: {}, votes: {}, tally: {} });

function load(): Db {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...(JSON.parse(raw) as Db) } : empty();
  } catch {
    return empty();
  }
}

function save(db: Db): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* 保存できない環境（プライベートモード等）では記録が残らないだけで動作は続ける */
  }
}

export function createLocalStore(): Store {
  const listeners = new Set<(t: Tally) => void>();
  const emit = (t: Tally) => listeners.forEach((cb) => cb({ ...t }));

  return {
    mode: "local",

    async register(p, priv) {
      const db = load();
      if (db.users[p.name]) return "taken";
      db.users[p.name] = { ...p, priv };
      save(db);
      return "ok";
    },

    async getProfile(name) {
      const u = load().users[name];
      return u ? { name: u.name, icon: u.icon, team: u.team } : null;
    },

    async updateProfile(name, patch, priv) {
      const db = load();
      const u = db.users[name];
      if (!u) return;
      Object.assign(u, patch);
      if (priv) u.priv = priv;
      save(db);
    },

    async vote(name, candidate) {
      const db = load();
      const rec: VoteRecord = { candidate, at: Date.now(), day: today() };
      (db.votes[name] ??= []).push(rec);
      db.tally[candidate] = (db.tally[candidate] ?? 0) + 1;
      save(db);
      emit(db.tally);
      return rec;
    },

    async myVotes(name) {
      return [...(load().votes[name] ?? [])].sort((a, b) => b.at - a.at);
    },

    watchTally(cb) {
      listeners.add(cb);
      cb({ ...load().tally });
      return () => {
        listeners.delete(cb);
      };
    },
  };
}
