import { CARDS, findCard } from "../data/cards";
import { state } from "../state";
import { $, esc, toast } from "../ui/dom";
import { cardView, pageHead } from "../ui/parts";
import type { View } from "./types";

/**
 * 並び順：★のカードを最優先、それ以外は登録順（最初に引いた順）。★同士も登録順。
 * 同じカードを重ねて引いたときは1枚にまとめ、枚数を表示する。
 */
function owned(): { id: string; count: number; first: number; fav: boolean }[] {
  const favs = new Set(state.me?.favs ?? []);
  const map = new Map<string, { id: string; count: number; first: number; fav: boolean }>();
  for (const c of state.cards) {
    const cur = map.get(c.card);
    if (cur) cur.count += 1;
    else map.set(c.card, { id: c.card, count: 1, first: c.at, fav: favs.has(c.card) });
  }
  return [...map.values()].sort((a, b) => Number(b.fav) - Number(a.fav) || a.first - b.first);
}

const gridHtml = (): string => {
  const list = owned();
  const have = new Set(list.map((x) => x.id));
  const missing = CARDS.filter((c) => !have.has(c.id));
  return `
    <p class="dexsum"><b>${list.length}</b> / ${CARDS.length} 種類　<span class="muted">★を押すと、お気に入りとして先頭に並びます</span></p>
    ${list.length ? "" : `<p class="notice">まだカードがありません。「集める」でガチャを引いてみましょう。 <a class="link" href="#/collect">集めるへ →</a></p>`}
    <div class="cgrid">
      ${list
        .map((x) => {
          const c = findCard(x.id);
          if (!c) return "";
          return `<div class="cslot">${cardView(
            c,
            `<button class="fav${x.fav ? " is-on" : ""}" type="button" data-fav="${c.id}" aria-pressed="${x.fav}" aria-label="${esc(c.player)} ${esc(c.kind)}をお気に入り${x.fav ? "から外す" : "にする"}">★</button>
             ${x.count > 1 ? `<span class="tcard__count">×${x.count}</span>` : ""}`,
          )}</div>`;
        })
        .join("")}
      ${missing.map(() => `<div class="cslot cslot--empty" aria-hidden="true"><span>?</span></div>`).join("")}
    </div>`;
};

export const collectionView: View = {
  title: "コレクション",
  html: () => `
    <div class="page wrap">
      <a class="crumb" href="#/collect">← 集める</a>
      ${pageHead("COLLECTION", "コレクション")}
      <div id="cgrid-box">${gridHtml()}</div>
    </div>`,
  bind: (root) => {
    root.addEventListener("click", async (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-fav]");
      const me = state.me;
      if (!btn || !me) return;
      const id = btn.dataset.fav ?? "";
      const on = !me.favs.includes(id);
      me.favs = on ? [...me.favs, id] : me.favs.filter((f) => f !== id);
      const box = $("#cgrid-box", root);
      if (box) box.innerHTML = gridHtml();
      try {
        await state.store.setFav(me.name, id, on);
      } catch (err) {
        console.error(err);
        toast("お気に入りを保存できませんでした。");
      }
    });
  },
};
