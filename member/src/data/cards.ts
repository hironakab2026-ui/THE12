import { CURRENT_12 } from "./candidates";
import { TEAMS } from "./teams";

/** トレカの種類（企画書：私服ショット・同期対決のペアショットなど） */
export type Rarity = "N" | "R" | "SR";

export interface Card {
  id: string;
  team: string;
  player: string;
  kind: string;
  rarity: Rarity;
  /** 画像（public/assets/players/） */
  image: string;
}

const KINDS: { key: string; kind: string; rarity: Rarity }[] = [
  { key: "n", kind: "レギュラー", rarity: "N" },
  { key: "r", kind: "私服ショット", rarity: "R" },
  { key: "sr", kind: "同期対決ペアショット", rarity: "SR" },
];

/** 12球団 × 3種類 = 36枚 */
export const CARDS: Card[] = TEAMS.flatMap((t, i) =>
  KINDS.map((k) => ({
    id: `${t.id}-${k.key}`,
    team: t.id,
    player: CURRENT_12[i].name,
    kind: k.kind,
    rarity: k.rarity,
    image: t.player,
  })),
);

export const findCard = (id: string): Card | undefined => CARDS.find((c) => c.id === id);

export interface Gacha {
  id: "pickup" | "normal";
  label: string;
  title: string;
  desc: string;
  /** 出やすさ（カードごとの重み） */
  weight: (c: Card) => number;
}

/** PICK UP：私服ショット特集（対象の私服ショットが通常の3倍出やすい） */
const PICKUP_TEAMS = ["tigers", "hawks", "carp"];

const BASE_WEIGHT: Record<Rarity, number> = { N: 70, R: 25, SR: 5 };

export const GACHAS: Gacha[] = [
  {
    id: "pickup",
    label: "PICK UP",
    title: "私服ショット特集",
    desc: "阪神・ソフトバンク・広島の私服ショットが3倍出やすい（〜12/20）",
    weight: (c) => BASE_WEIGHT[c.rarity] * (c.rarity === "R" && PICKUP_TEAMS.includes(c.team) ? 3 : 1),
  },
  {
    id: "normal",
    label: "NORMAL",
    title: "12球団オールスター",
    desc: "全36種類から出る、いつでも引けるガチャ",
    weight: (c) => BASE_WEIGHT[c.rarity],
  },
];

/** 重みに従ってランダムに1枚選ぶ */
export function drawOne(g: Gacha): Card {
  const total = CARDS.reduce((s, c) => s + g.weight(c), 0);
  let r = Math.random() * total;
  for (const c of CARDS) {
    r -= g.weight(c);
    if (r <= 0) return c;
  }
  return CARDS[CARDS.length - 1];
}
