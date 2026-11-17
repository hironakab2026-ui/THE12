export interface Team {
  id: string;
  name: string;
  short: string;
  league: "セ" | "パ";
  /** 紹介ページのヒーローで使っている選手画像（public/assets/players/） */
  player: string;
}

export const TEAMS: Team[] = [
  { id: "giants", name: "読売ジャイアンツ", short: "巨人", league: "セ", player: "player-01.webp" },
  { id: "tigers", name: "阪神タイガース", short: "阪神", league: "セ", player: "player-09.webp" },
  { id: "baystars", name: "横浜DeNAベイスターズ", short: "DeNA", league: "セ", player: "player-12.webp" },
  { id: "carp", name: "広島東洋カープ", short: "広島", league: "セ", player: "player-10.webp" },
  { id: "swallows", name: "東京ヤクルトスワローズ", short: "ヤクルト", league: "セ", player: "player-03.webp" },
  { id: "dragons", name: "中日ドラゴンズ", short: "中日", league: "セ", player: "player-04.webp" },
  { id: "hawks", name: "福岡ソフトバンクホークス", short: "ソフトバンク", league: "パ", player: "player-11.webp" },
  { id: "fighters", name: "北海道日本ハムファイターズ", short: "日本ハム", league: "パ", player: "player-07.webp" },
  { id: "marines", name: "千葉ロッテマリーンズ", short: "ロッテ", league: "パ", player: "player-08.webp" },
  { id: "eagles", name: "東北楽天ゴールデンイーグルス", short: "楽天", league: "パ", player: "player-06.webp" },
  { id: "buffaloes", name: "オリックス・バファローズ", short: "オリックス", league: "パ", player: "player-02.webp" },
  { id: "lions", name: "埼玉西武ライオンズ", short: "西武", league: "パ", player: "player-05.webp" },
];

/** 推し球団を決めていないときの値 */
export const NO_TEAM = "none";

export const findTeam = (id: string): Team | undefined => TEAMS.find((t) => t.id === id);
export const teamLabel = (id: string): string => findTeam(id)?.short ?? "まだ決めていない";

const base = import.meta.env.BASE_URL;
export const asset = (p: string): string => `${base}assets/${p}`;

/** 球団ロゴ（推し球団の選択・途中経過・カードで使う。会員アイコンとは別） */
export const teamIcon = (id: string): string => asset(`icons/${id}.webp`);
