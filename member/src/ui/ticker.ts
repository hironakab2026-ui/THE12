import type { Ad, Game } from "../data/media";
import { teamIcon, teamLabel } from "../data/teams";
import { esc } from "./dom";

export interface TickerItem {
  /** 左上のラベル（AD / 速報 など） */
  tag: string;
  title: string;
  sub: string;
  /** 広告画像（あれば左側に大きく表示） */
  img?: string;
  /** 小さいロゴ（投票速報の球団ロゴなど） */
  logo?: string;
}

/**
 * 広告POPUP：画面上部の帯で、画像つきの広告が右から左へ流れ続ける。
 * 同じ並びを2回つなげて切れ目なくループさせる。カーソルを乗せると止まる。
 */
export const ticker = (items: TickerItem[], label = "お知らせ"): string => {
  const row = items
    .map(
      (i) => `
      <span class="adcard${i.img ? "" : " adcard--text"}">
        ${i.img ? `<span class="adcard__img" style="--img:url('${i.img}')"></span>` : ""}
        <span class="adcard__body">
          <b class="adcard__tag">${esc(i.tag)}</b>
          <span class="adcard__title">${i.logo ? `<img src="${i.logo}" alt="" width="22" height="22" />` : ""}${esc(i.title)}</span>
          <span class="adcard__sub">${esc(i.sub)}</span>
        </span>
      </span>`,
    )
    .join("");
  // 項目数に合わせて流れる速さを一定に保つ
  const dur = Math.max(24, items.length * 6);
  return `
    <div class="ticker" role="region" aria-label="${esc(label)}">
      <div class="ticker__track" style="--dur:${dur}s">
        <div class="ticker__row">${row}</div>
        <div class="ticker__row" aria-hidden="true">${row}</div>
      </div>
    </div>`;
};

export const ads = (list: Ad[]): TickerItem[] => list.map((a) => ({ tag: "AD", title: a.title, sub: a.sub, img: a.img }));

/** 試合経過：流さずに最大6試合を並べて表示 */
export const scoreboard = (games: Game[]): string => `
  <section class="games" aria-labelledby="games-title">
    <h2 class="hsec-title" id="games-title"><span>TODAY'S GAMES</span>試合経過</h2>
    <ul class="games__grid">
      ${games
        .slice(0, 6)
        .map((g) => {
          const end = g.status === "試合終了";
          const row = (team: string, score: number, win: boolean) => `
            <span class="game__team${win ? " is-win" : ""}">
              <img src="${teamIcon(team)}" alt="" width="24" height="24" />
              <span class="game__name">${esc(teamLabel(team))}</span>
              <span class="game__score">${score}</span>
            </span>`;
          return `
          <li class="game${end ? " game--end" : ""}">
            <span class="game__status">${end ? "" : `<i class="game__live">LIVE</i>`}${esc(g.status)}</span>
            ${row(g.away, g.awayScore, end && g.awayScore > g.homeScore)}
            ${row(g.home, g.homeScore, end && g.homeScore > g.awayScore)}
            <span class="game__place">${esc(g.place)}</span>
          </li>`;
        })
        .join("")}
    </ul>
  </section>`;
