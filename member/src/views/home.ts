import { ADS, GAMES } from "../data/media";
import { asset } from "../data/teams";
import { leaders, state } from "../state";
import { esc } from "../ui/dom";
import { ILLUST, profileLine } from "../ui/parts";
import { ads, ticker, type TickerItem } from "../ui/ticker";
import type { View } from "./types";

const TILES = [
  { id: "join", href: "#/join", en: "JOIN", jp: "参加する", desc: "総選挙で、次の12人を決める", img: "contents/election.webp" },
  { id: "watch", href: "#/watch", en: "WATCH", jp: "見る", desc: "12人の限定映像を、すきま時間に", img: "contents/film.webp" },
  { id: "collect", href: "#/collect", en: "COLLECT", jp: "集める", desc: "ガチャで選手のトレカを集める", img: "contents/cards.webp" },
  { id: "taste", href: "#/taste", en: "TASTE", jp: "味わう", desc: "懐かしの球場グルメを、家でも", img: "contents/food.webp" },
];

const PERKS = [
  { id: "ticket", jp: "チケット早期購入", desc: "12球団の試合を、一般より先に" },
  { id: "points", jp: "ポイントクラブ", desc: "球場で使える、会員だけのポイント" },
];

/** 広告＋投票の途中経過（各球団の1位）＋試合経過（ダミー） */
const homeTicker = (): TickerItem[] => {
  const lead = leaders().map((l) => ({ tag: "速報", text: `${l.team.short} 1位：${l.c.name} ${l.votes.toLocaleString()}票` }));
  const games = GAMES.map((g) => ({ tag: "LIVE", text: g }));
  // 広告・速報・試合経過を交互に混ぜる
  const out: TickerItem[] = [];
  const a = ads(ADS.home);
  for (let i = 0; i < Math.max(a.length, lead.length, games.length); i++) {
    if (a[i]) out.push(a[i]);
    if (lead[i]) out.push(lead[i]);
    if (games[i]) out.push(games[i]);
  }
  return out;
};

export const homeView: View = {
  title: "ホーム",
  html: () => {
    const me = state.me;
    return `
    <div class="home">
      <div class="home__top wrap">
        ${me ? `<button class="me-chip" type="button" data-open-menu aria-label="メニューを開く">${profileLine(me)}</button>` : ""}
        <img class="home__logo" src="${asset("logo.webp")}" width="96" height="64" alt="THE 12" />
      </div>
      <div data-tour="ticker" id="home-ticker">${ticker(homeTicker(), "お知らせ・投票速報・試合経過")}</div>

      <div class="wrap">
        <p class="home__hello">おかえりなさい${me ? `、<b>${esc(me.name)}</b>さん` : ""}。</p>

        <nav class="tiles" aria-label="コンテンツ">
          ${TILES.map(
            (t) => `
            <a class="tile" href="${t.href}" data-tour="${t.id}" style="--img:url('${asset(t.img)}')">
              <span class="tile__bg" aria-hidden="true"></span>
              <span class="tile__illust">${ILLUST[t.id]}</span>
              <span class="tile__body">
                <span class="tile__en">${t.en}</span>
                <span class="tile__jp">${t.jp}</span>
                <span class="tile__desc">${t.desc}</span>
              </span>
            </a>`,
          ).join("")}
        </nav>

        <hr class="divider" />

        <section class="perks" data-tour="perks" aria-labelledby="perks-title">
          <h2 class="perks__title" id="perks-title"><span>MEMBER BENEFITS</span>入会特典</h2>
          <div class="perks__grid">
            ${PERKS.map(
              (p) => `
              <a class="perk" href="#/soon">
                <span class="perk__illust">${ILLUST[p.id]}</span>
                <span class="perk__jp">${p.jp}</span>
                <span class="perk__desc">${p.desc}</span>
              </a>`,
            ).join("")}
          </div>
        </section>
      </div>
    </div>`;
  },
  onTally: (root) => {
    const el = root.querySelector("#home-ticker");
    if (el) el.innerHTML = ticker(homeTicker(), "お知らせ・投票速報・試合経過");
  },
};
