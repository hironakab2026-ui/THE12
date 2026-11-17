import { ADS, GAMES } from "../data/media";
import { asset, teamIcon } from "../data/teams";
import { leaders, state } from "../state";
import { esc } from "../ui/dom";
import { ILLUST, profileLine } from "../ui/parts";
import { ads, scoreboard, ticker, type TickerItem } from "../ui/ticker";
import type { View } from "./types";

const TILES = [
  { id: "join", href: "#/join", en: "JOIN", jp: "参加する", desc: "総選挙で、次の12人を決める", img: "contents/election.webp" },
  { id: "watch", href: "#/watch", en: "WATCH", jp: "見る", desc: "12人の限定映像を、すきま時間に", img: "contents/film.webp" },
  { id: "collect", href: "#/collect", en: "COLLECT", jp: "集める", desc: "ガチャで選手のトレカを集める", img: "contents/cards.webp" },
  { id: "taste", href: "#/taste", en: "TASTE", jp: "味わう", desc: "懐かしの球場グルメを、家でも", img: "contents/food.webp" },
];

const PERKS = [
  { id: "ticket", href: "#/soon/ticket", jp: "チケット早期購入", desc: "12球団の試合を、一般より先に" },
  { id: "points", href: "#/soon/points", jp: "ポイントクラブ", desc: "球場で使える、会員だけのポイント" },
];

/** 流れる帯：画像つきの広告と、総選挙の速報（各球団の1位）を交互に */
const homeTicker = (): TickerItem[] => {
  const a = ads(ADS.home);
  const lead = leaders().map((l) => ({
    tag: "総選挙 速報",
    title: `${l.team.short} 1位：${l.c.name}`,
    sub: `${l.votes.toLocaleString()}票`,
    logo: teamIcon(l.team.id),
  }));
  const out: TickerItem[] = [];
  const perAd = Math.ceil(lead.length / a.length);
  a.forEach((ad, i) => out.push(ad, ...lead.slice(i * perAd, (i + 1) * perAd)));
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
      <div data-tour="ticker" id="home-ticker">${ticker(homeTicker(), "広告・総選挙の速報")}</div>

      <div class="wrap">
        <div data-tour="games">${scoreboard(GAMES)}</div>

        <p class="home__hello">おかえりなさい${me && !me.guest ? `、<b>${esc(me.name)}</b>さん` : ""}。</p>

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
              <a class="perk" href="${p.href}">
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
    if (el) el.innerHTML = ticker(homeTicker(), "広告・総選挙の速報");
  },
};
