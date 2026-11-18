import { renderContent } from "./render";

/**
 * ルーティング
 * - #/                       … HOME（1ページ構成のトップ）
 * - #/about #/contents #/membership #/faq … トップの各セクションへスクロール
 * - #/content/{id}           … コンテンツ詳細
 * - #/join                   … 入会（本番では会員ページ /member/ へ移動）
 */
type ViewName = "home" | "content-detail" | "join";

const SECTIONS = ["about", "contents", "membership", "faq"];

export type RouteListener = (view: ViewName) => void;

let current: ViewName | null = null;

function show(name: ViewName): boolean {
  const changed = current !== name;
  document.querySelectorAll<HTMLElement>(".view").forEach((v) => {
    v.classList.toggle("is-active", v.dataset.view === name);
  });
  document.body.dataset.view = name;
  current = name;
  return changed;
}

function scrollToSection(id: string | null, smooth: boolean): void {
  const el = id ? document.getElementById(id) : null;
  const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "instant" });
}

function run(onChange: RouteListener): void {
  const [head = "", arg] = location.hash.replace(/^#\/?/, "").split("/");

  if (head === "content" && arg) {
    renderContent(arg);
    show("content-detail");
    scrollToSection(null, false);
    onChange("content-detail");
    return;
  }
  if (head === "join") {
    // 入会ボタンの行き先：会員ページ（デモ）。本番ビルドでは /THE12/member/
    if (import.meta.env.PROD) {
      location.href = `${import.meta.env.BASE_URL}member/`;
      return;
    }
    show("join");
    scrollToSection(null, false);
    onChange("join");
    return;
  }

  // HOME とその各セクション
  const changed = show("home");
  onChange("home");
  const target = SECTIONS.includes(head) ? head : null;
  // 別ページから戻ったときは描画を待ってから移動
  requestAnimationFrame(() => scrollToSection(target, !changed));
}

export function startRouter(onChange: RouteListener): void {
  window.addEventListener("hashchange", () => run(onChange));
  run(onChange);
}
