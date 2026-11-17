import { asset } from "./teams";

/** 「見る」のダミー動画（動画本体は準備中） */
export interface Video {
  id: string;
  title: string;
  minutes: number;
  date: string;
  thumb: string;
}

export const VIDEOS: Video[] = [
  { id: "v1", title: "THE 12 ドキュメンタリー #11 ― 高峰 蓮、エースの背番号", minutes: 24, date: "2026-11-15", thumb: asset("players/player-01.webp") },
  { id: "v2", title: "時代を超えた対決 ― 1977年の王貞治 vs 2026年の現役エース", minutes: 12, date: "2026-11-10", thumb: asset("contents/film.webp") },
  { id: "v3", title: "通勤5分で見る 今週のTHE 12", minutes: 5, date: "2026-11-14", thumb: asset("players/player-09.webp") },
  { id: "v4", title: "12人座談会 ― シーズンを振り返って", minutes: 38, date: "2026-11-01", thumb: asset("contents/summit.webp") },
  { id: "v5", title: "昭和のV9巨人 vs 令和の日本一チーム", minutes: 15, date: "2026-10-25", thumb: asset("players/player-04.webp") },
  { id: "v6", title: "1分でわかる 推し選手の名場面", minutes: 1, date: "2026-11-16", thumb: asset("players/player-11.webp") },
  { id: "v7", title: "THE 12 ドキュメンタリー #10 ― 鷹野 光、走攻守の流儀", minutes: 22, date: "2026-10-15", thumb: asset("players/player-11.webp") },
  { id: "v8", title: "家族で見たナイター ― 球場フードの思い出", minutes: 8, date: "2026-11-08", thumb: asset("contents/food.webp") },
];

/** 広告POPUP（流れる帯）の中身 */
export const ADS = {
  home: ["THE 12 メンバー総選挙 開催中！ 12/20 まで", "PICK UP ガチャ「私服ショット特集」", "ファン首脳会議 2027年1月17日 開催決定", "復刻！ 昭和の球場カレー 12球場で販売中"],
  collect: ["PICK UP ガチャ開催中：私服ショット特集（阪神・ソフトバンク・広島）〜12/20", "NORMAL ガチャ：12球団オールスター 全36種類", "引いたカードは右下のアイコンからコレクションで見られます"],
  taste: ["復刻グルメ：昭和の球場カレー／レジェンドの好物 焼きそば", "球場フード対抗戦 今週の1位：甲子園「復刻カレー」", "イベント：家族でナイター 親子ユニフォームで来場するとフード1品プレゼント"],
};

/** 試合経過（ダミー） */
export const GAMES = ["巨人 3 - 2 阪神（7回表）", "ソフトバンク 1 - 1 日本ハム（5回裏）", "広島 4 - 0 中日（試合終了）", "楽天 2 - 5 西武（8回表）"];

/** ファン首脳会議（ダミー） */
export const SUMMIT = {
  date: "2027年1月17日（日）14:00〜16:00",
  place: "THE 12 ホール（東京都内）",
  stream: "THE 12 会員ページでライブ配信（終了後アーカイブあり）",
  about: "THE 12 の選手12人と、12球団のファン代表12人が同じテーブルで語り合う会議です。ファン代表は選手に直接質問できます。今回のテーマは「もう一度、球場へ行きたくなる理由」。",
  fans: ["しろくま", "とらきち", "ハマっ子", "もみじ", "つばめ", "どらこ", "たかぽん", "きたかぜ", "かもめ", "わしお", "うしまる", "れおん"],
};
