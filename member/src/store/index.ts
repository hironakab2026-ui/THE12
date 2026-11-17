import { FIREBASE_CONFIG } from "../config";
import { createLocalStore } from "./local";
import type { Store } from "./types";

/** Firebase の設定があれば Firestore、なければ端末内に保存する */
export async function createStore(): Promise<Store> {
  if (FIREBASE_CONFIG) {
    const { createFirebaseStore } = await import("./firebase");
    return createFirebaseStore(FIREBASE_CONFIG);
  }
  return createLocalStore();
}

/** このブラウザで登録したユーザー名（2回目以降はそのままホームを開くため） */
const SESSION = "the12.user";
const GUEST = "the12.guest";
const TOUR = "the12.tourDone";

const read = (k: string): string | null => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string | null): void => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* 保存できない環境では毎回登録画面になるだけ */
  }
};

export const session = {
  get: () => read(SESSION),
  set: (name: string) => {
    write(SESSION, name);
    write(GUEST, null);
  },
  clear: () => write(SESSION, null),
  /** ゲストとして見ている（登録なし） */
  isGuest: () => read(GUEST) === "1",
  setGuest: () => write(GUEST, "1"),
  tourDone: () => read(TOUR) === "1",
  setTourDone: () => write(TOUR, "1"),
};

export type { Store } from "./types";
