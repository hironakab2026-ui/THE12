/**
 * 会員アイコン（球団ロゴとは別）。
 * 班で用意する画像が届くまでの仮のイラスト（野球モチーフの線画）。
 * 差し替えるときは src を画像のパス（例：asset("avatars/xxx.webp")）に変える。
 */
const svg = (bg: string, body: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${bg}"/><g fill="none" stroke="#e6c87e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`,
  )}`;

export const AVATARS: { id: string; label: string; src: string }[] = [
  { id: "ball", label: "ボール", src: svg("#3a2a14", `<circle cx="32" cy="32" r="16"/><path d="M22 20c4 8 4 16 0 24M42 20c-4 8-4 16 0 24"/>`) },
  { id: "bat", label: "バット", src: svg("#1f2a3a", `<path d="M44 16l4 4-22 26-6 2 2-6z"/><path d="M18 46l-4 4"/><circle cx="46" cy="44" r="4"/>`) },
  { id: "glove", label: "グローブ", src: svg("#3a1f1a", `<path d="M22 46V28c0-3 4-3 4 0v-8c0-3 4-3 4 0v-2c0-3 4-3 4 0v4c0-3 4-3 4 0v12l4-4c2-2 5 1 3 3l-9 13H22z"/>`) },
  { id: "cap", label: "キャップ", src: svg("#1a2e24", `<path d="M16 38c0-10 7-18 16-18s16 8 16 18z"/><path d="M48 38h6c0 3-3 4-6 4H16"/><path d="M32 20v4"/>`) },
  { id: "helmet", label: "ヘルメット", src: svg("#2e1f33", `<path d="M14 40c0-12 8-20 18-20s18 8 18 20H24"/><path d="M14 40h10v6H14z"/><circle cx="38" cy="32" r="3"/>`) },
  { id: "stadium", label: "スタジアム", src: svg("#14222e", `<path d="M12 42c6-10 34-10 40 0"/><path d="M12 42v6h40v-6"/><path d="M20 22v12M44 22v12"/><path d="M16 22h8M40 22h8"/>`) },
  { id: "trophy", label: "トロフィー", src: svg("#33280f", `<path d="M24 16h16v10a8 8 0 0 1-16 0z"/><path d="M24 20h-6c0 6 3 8 6 8M40 20h6c0 6-3 8-6 8"/><path d="M32 34v8M24 48h16M27 42h10v6H27z"/>`) },
  { id: "megaphone", label: "メガホン", src: svg("#3a1a24", `<path d="M16 28v8h6l18 10V18L22 28z"/><path d="M46 26c3 3 3 9 0 12"/><path d="M22 36l3 10h5l-2-8"/>`) },
  { id: "base", label: "ホームベース", src: svg("#22301a", `<path d="M20 20h24v12L32 44 20 32z"/>`) },
  { id: "scoreboard", label: "スコアボード", src: svg("#1a1a2e", `<rect x="12" y="18" width="40" height="24" rx="2"/><path d="M20 26h6v8h-6zM38 26h6v8h-6z"/><path d="M28 48h8M32 42v6"/>`) },
  { id: "star", label: "スター", src: svg("#2e2414", `<path d="M32 14l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>`) },
  { id: "flag", label: "応援旗", src: svg("#331414", `<path d="M20 50V14"/><path d="M20 16c8-4 14 4 24 0v18c-10 4-16-4-24 0"/>`) },
];

export const DEFAULT_AVATAR = AVATARS[0].id;
export const avatarSrc = (id: string): string => AVATARS.find((a) => a.id === id)?.src ?? AVATARS[0].src;
