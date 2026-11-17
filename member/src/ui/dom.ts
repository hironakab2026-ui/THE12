/** テキストを HTML として安全に埋め込む */
export const esc = (s: string): string => s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

export const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);
export const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T[] =>
  [...root.querySelectorAll<T>(sel)];

export const reducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 画面下に短く出るお知らせ */
let toastTimer = 0;
export function toast(msg: string): void {
  let el = $("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add("is-shown");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el?.classList.remove("is-shown"), 2600);
}

/** 汎用モーダル。閉じたら resolve */
export function openModal(html: string, onBind?: (root: HTMLElement, close: () => void) => void): Promise<void> {
  return new Promise((resolve) => {
    const wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML = `<div class="modal__scrim" data-close></div><div class="modal__box" role="dialog" aria-modal="true">${html}</div>`;
    document.body.append(wrap);
    const close = () => {
      wrap.remove();
      document.removeEventListener("keydown", onKey);
      resolve();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    wrap.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
    onBind?.(wrap.querySelector<HTMLElement>(".modal__box")!, close);
    wrap.querySelector<HTMLElement>("button, input, a")?.focus();
  });
}

export const fmtTime = (ms: number): string => {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
