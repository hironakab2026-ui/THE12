import { CONTENTS, VERBS, contentImage, findContent } from "../data/contents";
import { FAQS, GRADES, PLANS } from "../data/membership";
import { LINEUP } from "../data/lineup";
import { renderLineup } from "./lineup";
import { contentBox, esc, featList, gradeStep, planCard, specList } from "./templates";

const $ = (id: string): HTMLElement => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`#${id} が見つかりません`);
  return el;
};

const verbOf = (id: string) => VERBS.find((v) => v.id === id) ?? VERBS[0];

/** 静的なリスト類を一度だけ描画する */
export function renderStatic(): void {
  renderLineup($("lineup"), $("stage-scene"));
  if (import.meta.env.DEV) {
    LINEUP.forEach((p, i) => {
      const next = LINEUP[i + 1];
      if (next && next.pose === p.pose) console.warn(`[lineup] 同じポーズが隣り合っています: ${p.file} / ${next.file}`);
    });
  }

  $("home-contents").innerHTML = VERBS.map((v) =>
    contentBox(v, CONTENTS.filter((c) => c.verb === v.id)),
  ).join("");

  $("home-plans").innerHTML = PLANS.map(planCard).join("");
  $("grades").innerHTML = GRADES.map(gradeStep).join("");

  $("home-faq").innerHTML = FAQS.map(
    (f) => `<details><summary>${esc(f.q)}</summary><p class="faq__a">${esc(f.a)}</p></details>`,
  ).join("");
}

/** コンテンツ詳細：タイトル部分の背景にイメージ画像を敷く */
export function renderContent(id: string): void {
  const c = findContent(id) ?? CONTENTS[0];
  const v = verbOf(c.verb);
  $("content-detail-body").innerHTML = `
    <header class="dhero" style="--img:url('${contentImage(c.id)}')">
      <div class="dhero__bg" aria-hidden="true"></div>
      <div class="wrap dhero__inner">
        <a class="crumb" href="#/contents">← CONTENTS</a>
        <p class="pagehead__en">${v.en}｜${esc(v.jp)}</p>
        <h1>${esc(c.jp)}</h1>
        <p class="pagehead__lead">${esc(c.desc)}</p>
      </div>
    </header>
    <div class="wrap">
      <p class="body-text dbody">${esc(c.body)}</p>
      ${specList(c.spec)}
      <h2 class="h-sub">主な内容</h2>
      ${featList(c.feats)}
      <div class="btnrow">
        <a class="btn btn--primary" href="#/join">無料ではじめる</a>
        <a class="btn btn--ghost" href="#/contents">CONTENTSへ戻る</a>
      </div>
    </div>`;
}
