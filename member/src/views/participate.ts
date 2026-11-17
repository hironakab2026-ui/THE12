import { ELECTION_DEADLINE, VOTES_PER_DAY } from "../config";
import { candidatesOf, findCandidate } from "../data/candidates";
import { SUMMIT } from "../data/media";
import { CURRENT_12 } from "../data/candidates";
import { NO_TEAM, TEAMS, asset, findTeam, teamLabel } from "../data/teams";
import { isGuest, rankingOf, state } from "../state";
import { today } from "../store/types";
import { $, $$, esc, fmtTime, openModal, toast } from "../ui/dom";
import { candidateName, pageHead, secTitle } from "../ui/parts";
import type { View } from "./types";

let selectedTeam = "";
let selectedCandidate = "";
let busy = false;

const remaining = (): number => Math.max(0, VOTES_PER_DAY - state.votes.filter((v) => v.day === today()).length);

const daysLeft = (): number => Math.max(0, Math.ceil((Date.parse(ELECTION_DEADLINE) - Date.now()) / 86_400_000));

/** 推し球団を先頭にした球団の並び */
const orderedTeams = () => {
  const mine = state.me?.team;
  return mine && mine !== NO_TEAM ? [...TEAMS].sort((a, b) => (a.id === mine ? -1 : b.id === mine ? 1 : 0)) : TEAMS;
};

/* ---------- 途中経過 ---------- */
const progressHtml = (): string => `
  <div class="progress">
    ${orderedTeams()
      .map((t) => {
        const rows = rankingOf(t.id);
        const max = rows[0]?.votes || 1;
        return `
        <article class="ptable">
          <h4 class="ptable__team"><img src="${asset(`icons/${t.id}.webp`)}" alt="" width="28" height="28" />${esc(t.short)}</h4>
          <ol class="ptable__list">
            ${rows
              .slice(0, 3)
              .map(
                (r, i) => `
              <li class="prow${i === 0 ? " prow--top" : ""}">
                <span class="prow__rank">${i + 1}</span>
                <span class="prow__name">${esc(r.c.name)}</span>
                <span class="prow__votes">${r.votes.toLocaleString()}<small>票</small></span>
                <span class="prow__bar" style="--w:${(r.votes / max) * 100}%"></span>
              </li>`,
              )
              .join("")}
          </ol>
          <p class="ptable__more">ほか ${rows.length - 3} 人</p>
        </article>`;
      })
      .join("")}
  </div>`;

/* ---------- 投票画面 ---------- */
const voteHtml = (): string => {
  const guest = isGuest();
  const left = guest ? 0 : remaining();
  const list = candidatesOf(selectedTeam);
  return `
  <div class="vote">
    ${
      guest
        ? `<div class="vote__status vote__status--guest">
             <span>ゲストは投票できません。候補選手と途中経過は見られます。</span>
             <button class="btn btn--primary btn--sm" type="button" data-register>会員登録して投票する</button>
           </div>`
        : `<div class="vote__status">
             <span>本日の残り投票回数</span>
             <b class="vote__left">${left}</b><span>/ ${VOTES_PER_DAY} 回</span>
           </div>`
    }

    <p class="vote__step">1. 球団を選ぶ</p>
    <div class="teamtabs" role="tablist" aria-label="球団">
      ${orderedTeams()
        .map(
          (t) => `
        <button class="teamtab${t.id === selectedTeam ? " is-on" : ""}" type="button" role="tab" aria-selected="${t.id === selectedTeam}" data-team="${t.id}">
          <img src="${asset(`icons/${t.id}.webp`)}" alt="" width="34" height="34" /><span>${esc(t.short)}</span>
        </button>`,
        )
        .join("")}
    </div>

    <p class="vote__step">2. 選手を選ぶ（背番号・${list.length}人）</p>
    <div class="cands" role="radiogroup" aria-label="${esc(teamLabel(selectedTeam))}の候補選手">
      ${list
        .map(
          (c) => `
        <label class="cand${c.id === selectedCandidate ? " is-on" : ""}">
          <input type="radio" name="cand" value="${c.id}" ${c.id === selectedCandidate ? "checked" : ""} />
          <span class="cand__label">背番号</span>
          <span class="cand__no">${c.no}</span>
        </label>`,
        )
        .join("")}
    </div>

    <button class="btn btn--primary btn--block vote__go" type="button" id="vote-go" ${!selectedCandidate || left === 0 ? "disabled" : ""}>
      ${guest ? "投票には会員登録が必要です" : left === 0 ? "本日の投票回数を使い切りました" : "3. 投票する"}
    </button>

    ${guest ? "" : `<h4 class="vote__histhead">あなたの投票履歴</h4>`}
    ${
      guest
        ? ""
        : state.votes.length
        ? `<ol class="history">${state.votes
            .slice(0, 30)
            .map((v) => `<li><time>${fmtTime(v.at)}</time><span>${esc(candidateName(v.candidate))}</span></li>`)
            .join("")}</ol>`
        : `<p class="muted">まだ投票していません。</p>`
    }
  </div>`;
};

/* ---------- ファン首脳会議 ---------- */
const summitHtml = (): string => `
  <dl class="spec">
    <div><dt>次回の日程</dt><dd>${esc(SUMMIT.date)}</dd></div>
    <div><dt>会場</dt><dd>${esc(SUMMIT.place)}</dd></div>
    <div><dt>配信</dt><dd>${esc(SUMMIT.stream)}</dd></div>
    <div><dt>開催頻度</dt><dd>半年に1回</dd></div>
  </dl>
  <p class="body-text">${esc(SUMMIT.about)}</p>
  <h3 class="h-sub">参加メンバー</h3>
  <div class="members">
    <div>
      <p class="members__head">選手 12人（今年の THE 12）</p>
      <ul class="members__list">${CURRENT_12.map((c) => `<li><img src="${asset(`icons/${c.team}.webp`)}" alt="" width="24" height="24" />${esc(findTeam(c.team)?.short ?? "")}<small>${esc(c.name)}</small></li>`).join("")}</ul>
    </div>
    <div>
      <p class="members__head">ファン代表 12人</p>
      <ul class="members__list">${SUMMIT.fans.map((f, i) => `<li><img src="${asset(`icons/${TEAMS[i].id}.webp`)}" alt="" width="24" height="24" />${esc(f)}<small>${esc(TEAMS[i].short)}ファン</small></li>`).join("")}</ul>
    </div>
  </div>`;

function rerenderVote(root: HTMLElement): void {
  const box = $("#vote-box", root);
  if (box) box.innerHTML = voteHtml();
}

export const participateView: View = {
  title: "参加する",
  html: () => {
    if (!selectedTeam) selectedTeam = state.me?.team && state.me.team !== NO_TEAM ? state.me.team : TEAMS[0].id;
    return `
    <div class="page wrap">
      ${pageHead("JOIN", "参加する")}

      <section class="block" id="election">
        ${secTitle("THE 12 ELECTION", "メンバー総選挙")}
        <p class="body-text">各球団で最も票を集めた1人が、来年の THE 12 になります。締切まであと <b class="hl">${daysLeft()}日</b>。</p>

        <h3 class="h-sub">途中経過</h3>
        <div id="progress-box">${progressHtml()}</div>

        <h3 class="h-sub">投票</h3>
        <div id="vote-box">${voteHtml()}</div>
      </section>

      <section class="block" id="summit">
        ${secTitle("FAN SUMMIT", "ファン首脳会議")}
        ${summitHtml()}
      </section>
    </div>`;
  },
  bind: (root) => {
    root.addEventListener("click", async (e) => {
      const tab = (e.target as HTMLElement).closest<HTMLElement>("[data-team]");
      if (tab) {
        selectedTeam = tab.dataset.team ?? selectedTeam;
        selectedCandidate = "";
        rerenderVote(root);
        return;
      }
      if ((e.target as HTMLElement).closest("[data-register]")) {
        window.dispatchEvent(new Event("the12:register"));
        return;
      }
      if ((e.target as HTMLElement).closest("#vote-go")) await confirmVote(root);
    });
    root.addEventListener("change", (e) => {
      const input = e.target as HTMLInputElement;
      if (input.name !== "cand") return;
      selectedCandidate = input.value;
      $$(".cand", root).forEach((l) => l.classList.toggle("is-on", l.querySelector("input")?.checked ?? false));
      const go = $<HTMLButtonElement>("#vote-go", root);
      if (go) go.disabled = isGuest() || remaining() === 0;
    });
  },
  onTally: (root) => {
    const box = $("#progress-box", root);
    if (box) box.innerHTML = progressHtml();
  },
};

async function confirmVote(root: HTMLElement): Promise<void> {
  const c = findCandidate(selectedCandidate);
  const me = state.me;
  if (!c || !me || me.guest || busy || remaining() === 0) return;
  let ok = false;
  await openModal(
    `<p class="modal__en">CONFIRM</p>
     <h2 class="modal__title">この選手に投票しますか？</h2>
     <p class="modal__big">${esc(c.name)}<small>${esc(teamLabel(c.team))}</small></p>
     <p class="muted">投票すると、本日の残り回数が1回減ります（残り${remaining()}回）。</p>
     <div class="modal__btns">
       <button class="btn btn--ghost" type="button" data-close>やめる</button>
       <button class="btn btn--primary" type="button" id="vote-ok">投票する</button>
     </div>`,
    (box, close) => {
      box.querySelector("#vote-ok")?.addEventListener("click", () => {
        ok = true;
        close();
      });
    },
  );
  if (!ok) return;
  busy = true;
  try {
    const rec = await state.store.vote(me.name, c.id);
    state.votes.unshift(rec);
    rerenderVote(root);
    await openModal(
      `<p class="modal__en">THANK YOU</p>
       <h2 class="modal__title">投票しました</h2>
       <p class="modal__big">${esc(c.name)}<small>${esc(teamLabel(c.team))}</small></p>
       <p class="muted">本日の残り投票回数は ${remaining()} 回です。途中経過に反映されています。</p>
       <div class="modal__btns"><button class="btn btn--ghost" type="button" data-close>閉じる</button></div>`,
    );
  } catch (err) {
    console.error(err);
    toast("投票を記録できませんでした。通信状況を確認して、もう一度お試しください。");
  } finally {
    busy = false;
  }
}
