/** 右端から出るハンバーガーメニュー */
export function setupMenu(): { close: () => void } {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const scrim = document.getElementById("menu-scrim");
  if (!burger || !menu || !scrim) return { close: () => undefined };

  const setOpen = (open: boolean) => {
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    scrim.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    menu.setAttribute("aria-hidden", String(!open));
  };

  burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  scrim.addEventListener("click", () => setOpen(false));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  return { close: () => setOpen(false) };
}

/** 同じ項目をもう一度押したとき（URLが変わらないとき）もスクロールさせる */
export function setupSameHashLinks(rerun: () => void): void {
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#/"]');
    if (!a) return;
    const same = a.getAttribute("href") === (location.hash || "#/");
    if (same) {
      e.preventDefault();
      rerun();
    }
  });
}

const reducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * スクロールで各項目がなめらかに浮かび上がる。
 * 画面の外に出たら元に戻すので、スクロールで戻ってきたときにも再び浮かび上がる。
 */
let io: IntersectionObserver | null = null;
export function bindReveals(): void {
  const els = document.querySelectorAll<HTMLElement>(".view.is-active .reveal");
  if (!("IntersectionObserver" in window) || reducedMotion()) {
    els.forEach((e) => e.classList.add("is-in"));
    return;
  }
  io?.disconnect();
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio >= 0.12) en.target.classList.add("is-in");
        else if (!en.isIntersecting) en.target.classList.remove("is-in"); // 完全に画面外へ出たら戻す
      });
    },
    { threshold: [0, 0.12] },
  );
  els.forEach((e) => io?.observe(e));
}

/**
 * HOME の登場アニメーション（THE 12 → おかえりなさい → 選手 → 観客席 → ボタン）。
 * 最初に開いたときに加え、HOME を一度離れてスクロールで戻ってきたときにも再生する。
 */
export function setupIntro(): void {
  const root = document.documentElement;
  const hero = document.getElementById("home");
  let timer = 0;

  const play = () => {
    if (reducedMotion()) return;
    root.classList.remove("intro");
    void root.offsetWidth; // アニメーションを最初からやり直すため、いったん描画を確定させる
    root.classList.add("intro");
    window.clearTimeout(timer);
    // 最後のボタンが出終わる（約4.3秒）のを待ってから外す
    timer = window.setTimeout(() => root.classList.remove("intro"), 5000);
  };

  if (root.classList.contains("intro")) play();
  if (!hero || !("IntersectionObserver" in window)) return;

  let left = false;
  new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) {
      left = true; // HOME が完全に見えなくなった
    } else if (left) {
      left = false;
      play(); // 戻ってきた
    }
  }).observe(hero);
}

/**
 * HOME が見えているかどうかで出し分けるボタン類。
 * - スマホ下部の入会ボタンの帯：HOME の入会ボタンが見えなくなったら表示（入会ページでは隠す）
 * - 右下の「ホームに戻る」：HOME が見えなくなったら表示
 */
export function setupFloatingButtons(): (view: string) => void {
  const bar = document.getElementById("sticky-cta");
  const toHome = document.getElementById("to-home");
  const heroCta = document.getElementById("hero-cta");
  const hero = document.getElementById("home");

  let ctaVisible = true;
  let heroVisible = true;
  let currentView = "home";

  const update = () => {
    const onHome = currentView === "home";
    bar?.classList.toggle("is-shown", currentView !== "join" && !(onHome && ctaVisible));
    toHome?.classList.toggle("is-shown", !(onHome && heroVisible));
  };

  if ("IntersectionObserver" in window) {
    if (heroCta) new IntersectionObserver(([en]) => { ctaVisible = en.isIntersecting; update(); }).observe(heroCta);
    // HOME の大半がスクロールで隠れたら「抜けた」とみなす
    if (hero) new IntersectionObserver(([en]) => { heroVisible = en.intersectionRatio > 0.35; update(); }, { threshold: [0, 0.35, 1] }).observe(hero);
  }

  return (view: string) => {
    currentView = view;
    update();
  };
}

