import { avatarSrc } from "../data/avatars";
import { findCandidate } from "../data/candidates";
import { teamLabel } from "../data/teams";
import type { Profile } from "../store/types";
import { esc } from "./dom";

/** 丸い会員アイコン（球団ロゴとは別） */
export const avatar = (icon: string, size = 40, alt = ""): string =>
  `<img class="avatar" src="${avatarSrc(icon)}" width="${size}" height="${size}" alt="${esc(alt)}" style="--s:${size}px" />`;

/** グレード：会員は一律ブロンズ。ゲストは GUEST */
export const gradeBadge = (guest = false): string =>
  guest ? `<span class="grade-badge grade-badge--guest" title="ゲスト">GUEST</span>` : `<span class="grade-badge" title="グレード">BRONZE</span>`;

/** アイコン・ユーザー名・グレード・推し球団 */
export const profileLine = (me: Profile): string => `
  <span class="me">
    ${avatar(me.icon, 44)}
    <span class="me__text">
      <span class="me__name">${esc(me.name)}</span>
      <span class="me__sub">${gradeBadge(me.guest)}<span class="me__team">${me.guest ? "閲覧のみ" : `推し：${esc(teamLabel(me.team))}`}</span></span>
    </span>
  </span>`;

/** ページ上部の見出し */
export const pageHead = (en: string, jp: string, lead = ""): string => `
  <div class="phead">
    <p class="phead__en">${en}</p>
    <h1 class="phead__jp">${esc(jp)}</h1>
    ${lead ? `<p class="phead__lead">${esc(lead)}</p>` : ""}
  </div>`;

export const secTitle = (en: string, jp: string): string =>
  `<h2 class="stitle"><span class="stitle__en">${en}</span><span class="stitle__jp">${esc(jp)}</span></h2>`;

export const candidateName = (id: string): string => {
  const c = findCandidate(id);
  return c ? `${teamLabel(c.team)} ${c.name}` : id;
};

/** 4つの楽しみ方などのイラスト（線画） */
export const ILLUST: Record<string, string> = {
  join: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="30" width="40" height="24" rx="2"/><path d="M8 54h48"/><path d="M24 30V12h16v18"/><path d="M28 20l4 4 6-8"/><path d="M22 38h20"/></svg>`,
  watch: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="34" rx="3"/><path d="M27 23v16l13-8z"/><path d="M22 54h20"/><path d="M32 48v6"/></svg>`,
  collect: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="16" width="26" height="36" rx="2" transform="rotate(-10 23 34)"/><rect x="28" y="12" width="26" height="36" rx="2" transform="rotate(8 41 30)"/><path d="M41 22l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z"/></svg>`,
  taste: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 32h48a24 18 0 0 1-48 0z"/><path d="M20 50h24"/><path d="M24 24c0-4 4-4 4-8M32 24c0-4 4-4 4-8M40 24c0-4 4-4 4-8"/></svg>`,
  ticket: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 20h52v8a4 4 0 0 0 0 8v8H6v-8a4 4 0 0 0 0-8z"/><path d="M40 20v24" stroke-dasharray="3 3"/><path d="M16 30h16M16 36h10"/></svg>`,
  points: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="15"/><path d="M27 40V24h7a5 5 0 0 1 0 10h-7"/></svg>`,
  book: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 14c8-3 16-3 22 2 6-5 14-5 22-2v36c-8-3-16-3-22 2-6-5-14-5-22-2z"/><path d="M32 16v36"/><path d="M16 24h10M16 31h10M38 24h10M38 31h10"/></svg>`,
};
