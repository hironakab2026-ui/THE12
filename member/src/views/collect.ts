import { ADS } from "../data/media";
import { asset } from "../data/teams";
import { $, esc, openModal } from "../ui/dom";
import { ILLUST, pageHead } from "../ui/parts";
import { ads, ticker } from "../ui/ticker";
import type { View } from "./types";

/** ガチャ（画面だけ用意。引く・コレクションは準備中） */
const GACHAS = [
  { id: "pickup", label: "PICK UP", title: "私服ショット特集", desc: "阪神・ソフトバンク・広島の私服ショットが出やすい（〜12/20）", img: "players/player-09.webp" },
  { id: "normal", label: "NORMAL", title: "12球団オールスター", desc: "全36種類から出る、いつでも引けるガチャ", img: "contents/cards.webp" },
];

let current = "pickup";

const gachaPanel = (): string => {
  const g = GACHAS.find((x) => x.id === current) ?? GACHAS[0];
  return `
    <div class="gtabs" role="tablist" aria-label="ガチャの種類">
      ${GACHAS.map((x) => `<button class="gtab${x.id === current ? " is-on" : ""}" type="button" role="tab" aria-selected="${x.id === current}" data-gacha="${x.id}">${x.label}</button>`).join("")}
    </div>
    <div class="gacha gacha--${g.id}" style="--img:url('${asset(g.img)}')">
      <span class="gacha__bg" aria-hidden="true"></span>
      <div class="gacha__body">
        <p class="gacha__label">${g.label}</p>
        <h2 class="gacha__title">${esc(g.title)}</h2>
        <p class="gacha__desc">${esc(g.desc)}</p>
        <div class="gacha__btns">
          <button class="btn btn--ghost gacha__btn" type="button" data-draw>1回引く</button>
          <button class="btn btn--primary gacha__btn" type="button" data-draw>10回引く</button>
        </div>
      </div>
    </div>`;
};

export const collectView: View = {
  title: "集める",
  html: () => `
    ${ticker(ads(ADS.collect), "開催中のガチャ")}
    <div class="page wrap">
      ${pageHead("COLLECT", "集める", "ガチャを引いて、選手のトレカを集めよう。")}
      <section class="block" id="gacha-box">${gachaPanel()}</section>
    </div>
    <a class="dex" href="#/soon/collection" aria-label="コレクションを見る">
      <span class="dex__icon">${ILLUST.book}</span>
      <span class="dex__tip" role="tooltip">コレクションを見る</span>
    </a>`,
  bind: (root) => {
    root.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("[data-draw]")) {
        void openModal(
          `<p class="modal__en">COMING SOON</p>
           <h2 class="modal__title">ガチャは準備中です</h2>
           <p class="muted">公開まで、もう少しお待ちください。</p>
           <div class="modal__btns"><button class="btn btn--ghost" type="button" data-close>閉じる</button></div>`,
        );
        return;
      }
      const tab = (e.target as HTMLElement).closest<HTMLElement>("[data-gacha]");
      if (!tab) return;
      current = tab.dataset.gacha ?? current;
      const box = $("#gacha-box", root);
      if (box) box.innerHTML = gachaPanel();
    });
  },
};
