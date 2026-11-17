/** 記録の保存先（Firebase または端末内）を同じ形で扱うための定義 */

export interface Profile {
  name: string;
  icon: string;
  team: string;
  /** ゲストログイン（登録なしで閲覧のみ。投票はできない） */
  guest?: boolean;
}

/** 性別・年代：集めるだけで画面には出さない（他の人からは読めない場所に保存） */
export interface PrivateInfo {
  gender: string;
  age: string;
}

export interface VoteRecord {
  candidate: string;
  /** ミリ秒 */
  at: number;
  /** "2026-11-17"（1日の残り回数の計算用） */
  day: string;
}

export type Tally = Record<string, number>;

export interface Store {
  readonly mode: "firebase" | "local";
  /** 登録。ユーザー名が使われていたら "taken" */
  register(p: Omit<Profile, "guest">, priv: PrivateInfo): Promise<"ok" | "taken">;
  getProfile(name: string): Promise<Profile | null>;
  updateProfile(name: string, patch: Partial<Pick<Profile, "icon" | "team">>, priv?: PrivateInfo): Promise<void>;
  vote(name: string, candidate: string): Promise<VoteRecord>;
  myVotes(name: string): Promise<VoteRecord[]>;
  /** 全員の得票数を購読（変わるたびに呼ばれる）。戻り値で購読をやめる */
  watchTally(cb: (t: Tally) => void): () => void;
}

export const today = (): string => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
