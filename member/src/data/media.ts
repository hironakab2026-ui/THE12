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
  { id: "v1", title: "THE 12 ドキュメンタリー #11 ― 巨人・背番号18 エースの覚悟", minutes: 24, date: "2026-11-15", thumb: asset("players/player-01.webp") },
  { id: "v2", title: "時代を超えた対決 ― 1977年の王貞治 vs 2026年の現役エース", minutes: 12, date: "2026-11-10", thumb: asset("contents/film.webp") },
  { id: "v3", title: "通勤5分で見る 今週のTHE 12", minutes: 5, date: "2026-11-14", thumb: asset("players/player-09.webp") },
  { id: "v4", title: "12人座談会 ― シーズンを振り返って", minutes: 38, date: "2026-11-01", thumb: asset("contents/summit.webp") },
  { id: "v5", title: "昭和のV9巨人 vs 令和の日本一チーム", minutes: 15, date: "2026-10-25", thumb: asset("players/player-04.webp") },
  { id: "v6", title: "1分でわかる 推し選手の名場面", minutes: 1, date: "2026-11-16", thumb: asset("players/player-11.webp") },
  { id: "v7", title: "THE 12 ドキュメンタリー #10 ― ソフトバンク・背番号3 走攻守の流儀", minutes: 22, date: "2026-10-15", thumb: asset("players/player-11.webp") },
  { id: "v8", title: "家族で見たナイター ― 球場フードの思い出", minutes: 8, date: "2026-11-08", thumb: asset("contents/food.webp") },
];

/**
 * 広告POPUP（流れる帯）の中身。
 * img は広告画像。班で用意した画像に差し替える（public/assets/ に置き、asset("ads/xxx.webp") のように指定）。
 */
export interface Ad {
  title: string;
  sub: string;
  img: string;
}

export const ADS: Record<"home" | "collect" | "taste", Ad[]> = {
  home: [
    { title: "THE 12 メンバー総選挙 開催中", sub: "あなたの1票で、来年の12人が決まる。12/20 まで", img: asset("contents/election.webp") },
    { title: "ファン首脳会議 開催決定", sub: "2027年1月17日（日）THE 12 ホール", img: asset("contents/summit.webp") },
    { title: "THE 12 ドキュメンタリー #11", sub: "巨人・背番号18 エースの覚悟", img: asset("contents/film.webp") },
    { title: "復刻！昭和の球場カレー", sub: "12球場で販売中", img: asset("contents/food.webp") },
  ],
  collect: [
    { title: "PICK UP ガチャ：私服ショット特集", sub: "阪神・ソフトバンク・広島 〜12/20", img: asset("contents/casual.webp") },
    { title: "NORMAL ガチャ：12球団オールスター", sub: "全36種類のトレカ", img: asset("contents/cards.webp") },
  ],
  taste: [
    { title: "復刻グルメ：昭和の球場カレー", sub: "レジェンドの好物 焼きそばも", img: asset("contents/food.webp") },
    { title: "球場フード対抗戦", sub: "今週の1位：甲子園「復刻カレー」", img: asset("crowd.webp") },
    { title: "家族でナイター", sub: "親子ユニフォームで来場するとフード1品プレゼント", img: asset("contents/rental.webp") },
  ],
};

/** 試合経過（ダミー）。ホームに最大6試合を並べて表示する */
export interface Game {
  away: string;
  home: string;
  awayScore: number;
  homeScore: number;
  status: string;
  place: string;
}

export const GAMES: Game[] = [
  { away: "tigers", home: "giants", awayScore: 2, homeScore: 3, status: "7回表", place: "東京ドーム" },
  { away: "dragons", home: "carp", awayScore: 0, homeScore: 4, status: "試合終了", place: "マツダスタジアム" },
  { away: "swallows", home: "baystars", awayScore: 5, homeScore: 5, status: "9回裏", place: "横浜スタジアム" },
  { away: "fighters", home: "hawks", awayScore: 1, homeScore: 1, status: "5回裏", place: "みずほPayPayドーム" },
  { away: "lions", home: "eagles", awayScore: 5, homeScore: 2, status: "8回表", place: "楽天モバイルパーク" },
  { away: "buffaloes", home: "marines", awayScore: 3, homeScore: 6, status: "試合終了", place: "ZOZOマリンスタジアム" },
];

/** ファン首脳会議（ダミー） */
export const SUMMIT = {
  date: "2027年1月17日（日）14:00〜16:00",
  place: "THE 12 ホール（東京都内）",
  stream: "THE 12 会員ページでライブ配信（終了後アーカイブあり）",
  about: "THE 12 の選手12人と、12球団のファン代表12人が同じテーブルで語り合う会議です。ファン代表は選手に直接質問できます。今回のテーマは「もう一度、球場へ行きたくなる理由」。",
  fans: ["しろくま", "とらきち", "ハマっ子", "もみじ", "つばめ", "どらこ", "たかぽん", "きたかぜ", "かもめ", "わしお", "うしまる", "れおん"],
};
