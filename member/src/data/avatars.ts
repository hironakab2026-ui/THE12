/**
 * 会員アイコン（球団ロゴとは別）。
 * 班で用意する画像が届くまでの仮のイラスト（野球モチーフの線画）。18種類 × 2色 = 36個。
 * 差し替えるときは src を画像のパス（例：asset("avatars/xxx.webp")）に変える。
 */
const svg = (bg: string, fg: string, body: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${bg}"/><g fill="none" stroke="${fg}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`,
  )}`;

/** モチーフ（線画） */
const MOTIFS: { id: string; label: string; body: string }[] = [
  { id: "ball", label: "ボール", body: `<circle cx="32" cy="32" r="16"/><path d="M22 20c4 8 4 16 0 24M42 20c-4 8-4 16 0 24"/>` },
  { id: "bat", label: "バット", body: `<path d="M44 16l4 4-22 26-6 2 2-6z"/><path d="M18 46l-4 4"/><circle cx="46" cy="44" r="4"/>` },
  { id: "glove", label: "グローブ", body: `<path d="M22 46V28c0-3 4-3 4 0v-8c0-3 4-3 4 0v-2c0-3 4-3 4 0v4c0-3 4-3 4 0v12l4-4c2-2 5 1 3 3l-9 13H22z"/>` },
  { id: "cap", label: "キャップ", body: `<path d="M16 38c0-10 7-18 16-18s16 8 16 18z"/><path d="M48 38h6c0 3-3 4-6 4H16"/><path d="M32 20v4"/>` },
  { id: "helmet", label: "ヘルメット", body: `<path d="M14 40c0-12 8-20 18-20s18 8 18 20H24"/><path d="M14 40h10v6H14z"/><circle cx="38" cy="32" r="3"/>` },
  { id: "stadium", label: "スタジアム", body: `<path d="M12 42c6-10 34-10 40 0"/><path d="M12 42v6h40v-6"/><path d="M20 22v12M44 22v12"/><path d="M16 22h8M40 22h8"/>` },
  { id: "trophy", label: "トロフィー", body: `<path d="M24 16h16v10a8 8 0 0 1-16 0z"/><path d="M24 20h-6c0 6 3 8 6 8M40 20h6c0 6-3 8-6 8"/><path d="M32 34v8M24 48h16M27 42h10v6H27z"/>` },
  { id: "megaphone", label: "メガホン", body: `<path d="M16 28v8h6l18 10V18L22 28z"/><path d="M46 26c3 3 3 9 0 12"/><path d="M22 36l3 10h5l-2-8"/>` },
  { id: "base", label: "ホームベース", body: `<path d="M20 20h24v12L32 44 20 32z"/>` },
  { id: "scoreboard", label: "スコアボード", body: `<rect x="12" y="18" width="40" height="24" rx="2"/><path d="M20 26h6v8h-6zM38 26h6v8h-6z"/><path d="M28 48h8M32 42v6"/>` },
  { id: "star", label: "スター", body: `<path d="M32 14l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>` },
  { id: "flag", label: "応援旗", body: `<path d="M20 50V14"/><path d="M20 16c8-4 14 4 24 0v18c-10 4-16-4-24 0"/>` },
  { id: "jersey", label: "ユニフォーム", body: `<path d="M24 14l-10 6 4 8 4-2v24h20V26l4 2 4-8-10-6c-2 4-6 5-8 5s-6-1-8-5z"/><path d="M28 32h8M28 38h8"/>` },
  { id: "medal", label: "メダル", body: `<path d="M24 12l8 14 8-14"/><circle cx="32" cy="38" r="12"/><path d="M32 32v12M28 36l4-4"/>` },
  { id: "sun", label: "デーゲーム", body: `<circle cx="32" cy="32" r="9"/><path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M46 18l-4 4M22 42l-4 4"/>` },
  { id: "moon", label: "ナイター", body: `<path d="M40 14a18 18 0 1 0 10 28A16 16 0 0 1 40 14z"/><path d="M20 20l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>` },
  { id: "light", label: "照明", body: `<rect x="18" y="12" width="28" height="14" rx="2"/><path d="M24 17h0M32 17h0M40 17h0M24 22h0M32 22h0M40 22h0" stroke-width="4"/><path d="M32 26v26M24 52h16"/>` },
  { id: "heart", label: "ハート", body: `<path d="M32 48S14 37 14 25a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 12-18 23-18 23z"/>` },
];

/** 色の組み合わせ（背景, 線） */
const PALETTES: [string, string][] = [
  ["#2a2114", "#e6c87e"],
  ["#14202e", "#9cc8f0"],
];

export const AVATARS: { id: string; label: string; src: string }[] = PALETTES.flatMap(([bg, fg], pi) =>
  MOTIFS.map((m) => ({ id: pi === 0 ? m.id : `${m.id}-${pi + 1}`, label: m.label, src: svg(bg, fg, m.body) })),
);

export const DEFAULT_AVATAR = AVATARS[0].id;
export const avatarSrc = (id: string): string => AVATARS.find((a) => a.id === id)?.src ?? AVATARS[0].src;
