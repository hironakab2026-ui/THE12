import type { LineupPlayer } from "../types";

/**
 * ヒーローに並べる12人（イメージ画像）。
 * 元画像：「イメージ　選手」フォルダ → 背景除去済みの public/assets/players/*.webp
 * 総選挙の前なので、番号・ポジションなどの個別情報は出さない。
 *
 * 並べ方のルール
 * - 配列の順番＝左から右。中央（6・7番目）が最も大きく、外側ほど小さい山型。
 * - 同じポーズ（pose）の選手を隣同士にしない。
 * - 横に広い写真（巨人など）は外側、細身の写真は中央に置くと全体を大きく表示できる。
 * 画像の寸法とシルエット形状は lineup-profiles.json（scripts/lineup-profiles.mjs で生成）。
 */
export const LINEUP: LineupPlayer[] = [
  { file: "player-10.webp", pose: "cheer", team: "広島東洋カープ" },
  { file: "player-05.webp", pose: "bat", team: "埼玉西武ライオンズ" },
  { file: "player-03.webp", pose: "cheer", team: "東京ヤクルトスワローズ" },
  { file: "player-08.webp", pose: "pitch", team: "千葉ロッテマリーンズ" },
  { file: "player-07.webp", pose: "bat", team: "北海道日本ハムファイターズ" },
  { file: "player-04.webp", pose: "stand", team: "中日ドラゴンズ" },
  { file: "player-11.webp", pose: "cheer", team: "福岡ソフトバンクホークス" },
  { file: "player-02.webp", pose: "pitch", team: "オリックス・バファローズ" },
  { file: "player-06.webp", pose: "bat", team: "東北楽天ゴールデンイーグルス" },
  { file: "player-12.webp", pose: "cheer", team: "横浜DeNAベイスターズ" },
  { file: "player-09.webp", pose: "bat", team: "阪神タイガース" },
  { file: "player-01.webp", pose: "pitch", team: "読売ジャイアンツ" },
];
