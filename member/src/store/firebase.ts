import { initializeApp } from "firebase/app";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { OwnedCard, Store, Tally, VoteRecord } from "./types";
import { today } from "./types";

/**
 * Firestore に保存する（全員で共有される）。
 *
 * コレクション構成（書き込みの制限は member/firestore.rules）
 * - users/{ユーザー名}          … アイコン・推し球団・★のカード
 *   - votes/{自動ID}           … 投票履歴（1票1件）
 *   - cards/{自動ID}           … ガチャで引いたカード（1枚1件）
 * - private/{ユーザー名}        … 性別・年代（画面からは読まない。Firebase の管理画面で確認する）
 * - tally/{候補ID}             … 得票数
 */
export function createFirebaseStore(config: Record<string, string>): Store {
  const db = getFirestore(initializeApp(config));
  const userRef = (name: string) => doc(db, "users", name);
  const millis = (v: unknown): number => (v instanceof Timestamp ? v.toMillis() : typeof v === "number" ? v : Date.now());

  return {
    mode: "firebase",

    async register(p, priv) {
      return runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef(p.name));
        if (snap.exists()) return "taken" as const;
        tx.set(userRef(p.name), { icon: p.icon, team: p.team, favs: [], createdAt: serverTimestamp() });
        tx.set(doc(db, "private", p.name), { gender: priv.gender, age: priv.age });
        return "ok" as const;
      });
    },

    async getProfile(name) {
      const snap = await getDoc(userRef(name));
      if (!snap.exists()) return null;
      const d = snap.data();
      return { name, icon: String(d.icon), team: String(d.team), favs: Array.isArray(d.favs) ? d.favs.map(String) : [] };
    },

    async updateProfile(name, patch, priv) {
      if (Object.keys(patch).length) await updateDoc(userRef(name), patch);
      if (priv) await setDoc(doc(db, "private", name), { gender: priv.gender, age: priv.age });
    },

    async vote(name, candidate) {
      const rec: VoteRecord = { candidate, at: Date.now(), day: today() };
      const batch = writeBatch(db);
      batch.set(doc(db, "tally", candidate), { count: increment(1) }, { merge: true });
      batch.set(doc(collection(db, "users", name, "votes")), { candidate, day: rec.day, at: serverTimestamp() });
      await batch.commit();
      return rec;
    },

    async myVotes(name) {
      const snap = await getDocs(collection(db, "users", name, "votes"));
      return snap.docs
        .map((d) => ({ candidate: String(d.get("candidate")), day: String(d.get("day")), at: millis(d.get("at")) }))
        .sort((a, b) => b.at - a.at);
    },

    watchTally(cb) {
      return onSnapshot(collection(db, "tally"), (snap) => {
        const t: Tally = {};
        snap.forEach((d) => {
          t[d.id] = Number(d.get("count")) || 0;
        });
        cb(t);
      });
    },

    async addCards(name, cards) {
      const now = Date.now();
      const added: OwnedCard[] = cards.map((card, i) => ({ card, at: now + i }));
      const batch = writeBatch(db);
      added.forEach((c) => batch.set(doc(collection(db, "users", name, "cards")), c));
      await batch.commit();
      return added;
    },

    async myCards(name) {
      const snap = await getDocs(collection(db, "users", name, "cards"));
      return snap.docs.map((d) => ({ card: String(d.get("card")), at: Number(d.get("at")) })).sort((a, b) => a.at - b.at);
    },

    async setFav(name, card, fav) {
      await updateDoc(userRef(name), { favs: fav ? arrayUnion(card) : arrayRemove(card) });
    },
  };
}
