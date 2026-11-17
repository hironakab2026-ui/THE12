import { contentImage } from "../data/contents";
import type { Content, Grade, Plan, VerbInfo } from "../types";

/** テキストを HTML として安全に埋め込む */
export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

/** コンテンツ1件（背景画像つきのパネル） */
const contentItem = (c: Content): string => `
  <a class="citem" href="#/content/${c.id}" style="--img:url('${contentImage(c.id)}')">
    <span class="citem__bg" aria-hidden="true"></span>
    <span class="citem__body">
      <span class="citem__en">${c.en}</span>
      <span class="citem__title">${esc(c.jp)}</span>
      <span class="citem__desc">${esc(c.desc)}</span>
    </span>
  </a>`;

/**
 * 楽しみ方ごとの大枠（2×2 の1マス）。
 * 2件以上あるマスは同じ大きさに収め、カーソルを乗せた方が広がって文字が出る。
 */
export const contentBox = (verb: VerbInfo, items: Content[]): string => `
  <div class="cbox${items.length > 1 ? " cbox--multi" : ""}">
    <p class="cbox__head"><span class="cbox__en">${verb.en}</span><span class="cbox__jp">${esc(verb.jp)}</span></p>
    <div class="cbox__items">${items.map(contentItem).join("")}</div>
  </div>`;

export const planCard = (p: Plan): string => `
  <article class="plan${p.recommended ? " plan--rec" : ""}">
    ${p.badge ? `<p class="plan__badge">${esc(p.badge)}</p>` : ""}
    <p class="plan__en">${esc(p.en)}</p>
    <h3 class="plan__name">${esc(p.name)}</h3>
    <p class="plan__price"><span class="plan__num">${p.price}</span><span class="plan__unit">${esc(p.unit)}</span></p>
    ${p.lead ? `<p class="plan__lead">${esc(p.lead)}</p>` : ""}
    <ul class="plan__perks">${p.perks.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <a class="btn ${p.recommended ? "btn--primary" : "btn--ghost"} btn--block" href="#/join">${p.price === "0" ? "無料ではじめる" : `${esc(p.name)}ではじめる`}</a>
  </article>`;

export const gradeStep = (g: Grade): string => `
  <li class="grade"><span class="grade__en">${g.en}</span><span class="grade__name">${esc(g.name)}</span><span class="grade__pt">${esc(g.points)}</span></li>`;

export const specList = (rows: [string, string][]): string =>
  `<dl class="spec">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;

export const featList = (items: string[]): string =>
  `<ul class="feat">${items.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`;
