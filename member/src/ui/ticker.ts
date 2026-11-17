import { esc } from "./dom";

export interface TickerItem {
  text: string;
  /** 帯の中で目立たせるラベル（例：AD / 速報 / LIVE） */
  tag: string;
}

/**
 * 広告POPUP：画面上部の帯で、項目が右から左へ流れ続ける。
 * 同じ並びを2回つなげて、切れ目なくループさせる。カーソルを乗せると止まる。
 */
export const ticker = (items: TickerItem[], label = "お知らせ"): string => {
  const row = items
    .map((i) => `<span class="ticker__item"><b class="ticker__tag">${esc(i.tag)}</b>${esc(i.text)}</span>`)
    .join("");
  // 項目数に合わせて流れる速さを一定に保つ
  const dur = Math.max(18, items.length * 7);
  return `
    <div class="ticker" role="region" aria-label="${esc(label)}">
      <div class="ticker__track" style="--dur:${dur}s">
        <div class="ticker__row">${row}</div>
        <div class="ticker__row" aria-hidden="true">${row}</div>
      </div>
    </div>`;
};

export const ads = (texts: string[]): TickerItem[] => texts.map((text) => ({ tag: "AD", text }));
