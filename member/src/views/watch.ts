import { VIDEOS, type Video } from "../data/media";
import { $, esc } from "../ui/dom";
import { pageHead, secTitle } from "../ui/parts";
import type { View } from "./types";

const videoCard = (v: Video): string => `
  <a class="video" href="#/soon/video/${v.id}">
    <span class="video__thumb" style="--img:url('${v.thumb}')">
      <span class="video__play" aria-hidden="true">▶</span>
      <span class="video__min">${v.minutes}分</span>
    </span>
    <span class="video__title">${esc(v.title)}</span>
  </a>`;

const row = (list: Video[]): string => `<div class="vrow">${list.map(videoCard).join("")}</div>`;

/** おすすめ：短い動画から（出戻り層は時間がないため） */
const recommended = (): Video[] => [...VIDEOS].sort((a, b) => a.minutes - b.minutes).slice(0, 4);
const latest = (): Video[] => [...VIDEOS].sort((a, b) => b.date.localeCompare(a.date));

const results = (q: string): string => {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return `<p class="muted">キーワードを入れると、タイトルから動画を探せます。</p>`;
  const hit = VIDEOS.filter((v) => words.every((w) => v.title.toLowerCase().includes(w)));
  return hit.length ? row(hit) : `<p class="muted">「${esc(q)}」に合う動画は見つかりませんでした。</p>`;
};

export const watchView: View = {
  title: "見る",
  html: () => `
    <div class="page wrap">
      ${pageHead("WATCH", "見る", "THE 12 の限定映像を、移動中のすきま時間に。")}

      <section class="block">
        ${secTitle("FOR YOU", "あなたへのおすすめ")}
        ${row(recommended())}
      </section>

      <section class="block">
        ${secTitle("SEARCH", "動画検索")}
        <label class="search">
          <span class="visually-hidden">動画を検索</span>
          <input type="search" id="vsearch" placeholder="選手名・キーワードで検索（例：ドキュメンタリー）" autocomplete="off" />
        </label>
        <div id="vresults">${results("")}</div>
      </section>

      <section class="block">
        ${secTitle("LATEST", "最新の動画")}
        ${row(latest())}
      </section>
    </div>`,
  bind: (root) => {
    const input = $<HTMLInputElement>("#vsearch", root);
    const out = $("#vresults", root);
    input?.addEventListener("input", () => {
      if (out) out.innerHTML = results(input.value);
    });
  },
};
