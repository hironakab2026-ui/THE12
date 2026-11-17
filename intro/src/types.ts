/** 4つの楽しみ方（企画書 11/15「メインコンテンツ／＋αコンテンツ」） */
export type Verb = "join" | "watch" | "collect" | "taste";

export interface VerbInfo {
  id: Verb;
  jp: string;
  en: string;
}

export interface Content {
  id: string;
  no: string;
  verb: Verb;
  en: string;
  jp: string;
  /** カードに表示する一文 */
  desc: string;
  /** 詳細ページ本文 */
  body: string;
  feats: string[];
  spec: [label: string, value: string][];
}

/** ヒーローの12人ラインナップ（背景除去済みのイメージ画像） */
export interface LineupPlayer {
  /** public/assets/players/ 内のファイル名 */
  file: string;
  /** ポーズの種類（隣同士で重ならないように並べるため） */
  pose: "pitch" | "bat" | "cheer" | "stand";
  /** 代替テキスト用の所属球団 */
  team: string;
}

export interface Plan {
  id: string;
  name: string;
  en: string;
  price: string;
  unit: string;
  /** 入会導線として強調するプラン（塗りボタン＋金枠） */
  recommended: boolean;
  /** カード上部のラベル（任意） */
  badge?: string;
  /** 価格の下の一言（任意） */
  lead?: string;
  perks: string[];
}

export interface Grade {
  name: string;
  en: string;
  points: string;
}

export interface Faq {
  q: string;
  a: string;
}
