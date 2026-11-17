import { ADS } from "../data/media";
import { CARDS, GACHAS, drawOne, findCard, type Gacha } from "../data/cards";
import { asset } from "../data/teams";
import { state } from "../state";
import { $, esc, openModal, toast } from "../ui/dom";
import { ILLUST, cardView, pageHead } from "../ui/parts";
import { ads, ticker } from "../ui/ticker";
import type { View } from "./types";

let current: Gacha["id"] = "pickup";
let busy = false;

const gachaPanel = (): string => {
  const g = GACHAS.find((x) => x.id === current) ?? GACHAS[0];
  const owned = new Set(state.cards.map((c) => c.card)).size;
  return `
    <div class="gtabs" role="tablist" aria-label="ガチャの種類">
      ${GACHAS.map((x) => `<button class="gtab${x.id === current ? " is-on" : ""}" type="button" role="tab" aria-selected="${x.id === current}" data-gacha="${x.id}">${x.label}</button>`).join("")}
    </div>
    <div class="gacha gacha--${g.id}" style="--img:url('${asset(g.id === "pickup" ? "players/player-09.webp" : "contents/cards.webp")}')">
      <span class="gacha__bg" aria-hidden="true"></span>
      <div class="gacha__body">
        <p class="gacha__label">${g.label}</p>
        <h2 class="gacha__title">${esc(g.title)}</h2>
        <p class="gacha__desc">${esc(g.desc)}</p>
        <p class="gacha__rate">出現率：N 70% ／ R 25% ／ SR 5%${g.id === "pickup" ? "（対象の私服ショットは3倍）" : ""}</p>
        <div class="gacha__btns">
          <button class="btn btn--ghost gacha__btn" type="button" data-draw="1">1回引く</button>
          <button class="btn btn--primary gacha__btn" type="button" data-draw="10">10回引く</button>
        </div>
      </div>
    </div>
    <p class="muted center">あなたのコレクション：${owned} / ${CARDS.length} 種類</p>`;
};

export const collectView: View = {
  title: "集める",
  html: () => `
    ${ticker(ads(ADS.collect), "開催中のガチャ")}
    <div class="page wrap">
      ${pageHead("COLLECT", "集める", "ガチャを引いて、選手のトレカを集めよう。")}
      <section class="block" id="gacha-box">${gachaPanel()}</section>
    </div>
    <a class="dex" href="#/collection" aria-label="コレクションを見る">
      <span class="dex__icon">${ILLUST.book}</span>
      <span class="dex__tip" role="tooltip">コレクションを見る</span>
    </a>`,
  bind: (root) => {
    root.addEventListener("click", async (e) => {
      const t = e.target as HTMLElement;
      const tab = t.closest<HTMLElement>("[data-gacha]");
      if (tab) {
        current = tab.dataset.gacha as Gacha["id"];
        const box = $("#gacha-box", root);
        if (box) box.innerHTML = gachaPanel();
        return;
      }
      const btn = t.closest<HTMLElement>("[data-draw]");
      if (btn) await draw(Number(btn.dataset.draw), root);
    });
  },
};

async function draw(times: number, root: HTMLElement): Promise<void> {
  const me = state.me;
  if (!me || busy) return;
  busy = true;
  const g = GACHAS.find((x) => x.id === current) ?? GACHAS[0];
  const ids = Array.from({ length: times }, () => drawOne(g).id);
  try {
    const added = await state.store.addCards(me.name, ids);
    const before = new Set(state.cards.map((c) => c.card));
    state.cards.push(...added);
    await openModal(
      `<p class="modal__en">${g.label} ・ ${times}回</p>
       <h2 class="modal__title">ガチャの結果</h2>
       <div class="pulls pulls--${times > 1 ? "many" : "one"}">
         ${ids
           .map((id, i) => {
             const c = findCard(id);
             // 今回はじめて手に入れたカードだけ NEW（同じ回で2枚目以降は NEW にしない）
             const isNew = !before.has(id);
             before.add(id);
             return c ? `<div class="pull" style="--i:${i}">${cardView(c, isNew ? `<span class="tcard__new">NEW</span>` : "")}</div>` : "";
           })
           .join("")}
       </div>
       <div class="modal__btns">
         <a class="btn btn--ghost" href="#/collection" data-close>コレクションを見る</a>
         <button class="btn btn--primary" type="button" data-close>閉じる</button>
       </div>`,
    );
    const box = $("#gacha-box", root);
    if (box) box.innerHTML = gachaPanel();
  } catch (err) {
    console.error(err);
    toast("カードを記録できませんでした。通信状況を確認して、もう一度お試しください。");
  } finally {
    busy = false;
  }
}
