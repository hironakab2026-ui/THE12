import { asset } from "../data/teams";
import { session } from "../store";
import { reducedMotion } from "./dom";

/** 使い方紹介（S-00T）：ホームのボックスを順に光らせて解説する */
const STEPS: { target: string; title: string; text: string }[] = [
  { target: "ticker", title: "お知らせの帯", text: "最新情報や、総選挙の速報が流れます。" },
  { target: "games", title: "試合経過", text: "今日の試合の途中経過と結果を、まとめて確認できます。" },
  { target: "join", title: "参加する", text: "推しの選手に投票して、次の THE 12 を決めよう。ファン首脳会議の情報もここに。" },
  { target: "watch", title: "見る", text: "12人の限定映像を、移動中のすきま時間に。" },
  { target: "collect", title: "集める", text: "ガチャで選手のトレカを集めよう。お気に入りには★を。" },
  { target: "taste", title: "味わう", text: "懐かしの球場グルメを、球場でも、家でも。" },
  { target: "perks", title: "入会特典", text: "チケットの早期購入や、球場で使えるポイントクラブ。" },
];

export function startTour(): Promise<void> {
  return new Promise((resolve) => {
    const layer = document.createElement("div");
    layer.className = "tour";
    layer.innerHTML = `
      <div class="tour__spot" aria-hidden="true"></div>
      <div class="tour__bubble" role="dialog" aria-live="polite">
        <p class="tour__count"></p>
        <h2 class="tour__title"></h2>
        <p class="tour__text"></p>
        <div class="tour__btns">
          <button class="tour__skip" type="button">スキップ</button>
          <button class="btn btn--primary btn--sm tour__next" type="button">次へ</button>
        </div>
      </div>`;
    document.body.append(layer);
    document.body.classList.add("is-locked");
    const spot = layer.querySelector<HTMLElement>(".tour__spot")!;
    const bubble = layer.querySelector<HTMLElement>(".tour__bubble")!;
    const next = layer.querySelector<HTMLButtonElement>(".tour__next")!;
    let i = 0;

    const place = () => {
      const s = STEPS[i];
      const el = document.querySelector<HTMLElement>(`[data-tour="${s.target}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pad = 8;
      Object.assign(spot.style, {
        top: `${r.top - pad}px`,
        left: `${r.left - pad}px`,
        width: `${r.width + pad * 2}px`,
        height: `${r.height + pad * 2}px`,
      });
      // 吹き出しは、光らせた箱の下に入らなければ上に出す
      const bh = bubble.offsetHeight;
      const below = r.bottom + pad + 14;
      const top = below + bh < window.innerHeight ? below : Math.max(12, r.top - pad - 14 - bh);
      const left = Math.min(Math.max(12, r.left), window.innerWidth - bubble.offsetWidth - 12);
      Object.assign(bubble.style, { top: `${top}px`, left: `${left}px` });
    };

    const show = () => {
      const s = STEPS[i];
      layer.querySelector(".tour__count")!.textContent = `${i + 1} / ${STEPS.length}`;
      layer.querySelector(".tour__title")!.textContent = s.title;
      layer.querySelector(".tour__text")!.textContent = s.text;
      next.textContent = i === STEPS.length - 1 ? "はじめる" : "次へ";
      const el = document.querySelector<HTMLElement>(`[data-tour="${s.target}"]`);
      el?.scrollIntoView({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" });
      // スクロールが落ち着いてから位置を合わせる
      window.setTimeout(place, reducedMotion() ? 0 : 380);
      place();
      next.focus();
    };

    const finish = () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
      layer.remove();
      showWelcome().then(() => {
        document.body.classList.remove("is-locked");
        session.setTourDone();
        resolve();
      });
    };

    next.addEventListener("click", () => {
      if (i < STEPS.length - 1) {
        i += 1;
        show();
      } else finish();
    });
    layer.querySelector(".tour__skip")!.addEventListener("click", finish);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    show();
  });
}

/** 最後のメッセージ「はじめまして。そして、おかえりなさい。～The 12～」 */
function showWelcome(): Promise<void> {
  return new Promise((resolve) => {
    window.scrollTo({ top: 0 });
    const el = document.createElement("button");
    el.type = "button";
    el.className = "welcome";
    el.innerHTML = `
      <span class="welcome__glow" aria-hidden="true"></span>
      <span class="welcome__line welcome__line--1">はじめまして。</span>
      <span class="welcome__line welcome__line--2">そして、おかえりなさい。</span>
      <span class="welcome__brand"><span>〜</span><img src="${asset("logo.webp")}" width="120" height="80" alt="The 12" /><span>〜</span></span>
      <span class="welcome__tap">タップしてはじめる</span>`;
    document.body.append(el);
    el.focus();
    el.addEventListener("click", () => {
      el.classList.add("is-out");
      window.setTimeout(() => {
        el.remove();
        resolve();
      }, reducedMotion() ? 0 : 450);
    });
  });
}
