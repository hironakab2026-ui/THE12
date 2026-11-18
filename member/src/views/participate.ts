import { CURRENT_12 } from "../data/candidates";
import { SUMMIT } from "../data/media";
import { TEAMS, findTeam, teamIcon } from "../data/teams";
import { esc } from "../ui/dom";
import { pageHead, secTitle } from "../ui/parts";
import type { View } from "./types";

/** 参加する：ファン首脳会議（表示のみ。メンバー総選挙は「選ぶ」へ移した） */
export const participateView: View = {
  title: "参加する",
  html: () => `
    <div class="page wrap">
      <a class="crumb" href="#/">← ホーム</a>
      ${pageHead("JOIN", "参加する")}

      <section class="block" id="summit">
        ${secTitle("FAN SUMMIT", "ファン首脳会議")}
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
            <ul class="members__list">${CURRENT_12.map((c) => `<li><img src="${teamIcon(c.team)}" alt="" width="24" height="24" />${esc(findTeam(c.team)?.short ?? "")}<small>${esc(c.name)}</small></li>`).join("")}</ul>
          </div>
          <div>
            <p class="members__head">ファン代表 12人</p>
            <ul class="members__list">${SUMMIT.fans.map((f, i) => `<li><img src="${teamIcon(TEAMS[i].id)}" alt="" width="24" height="24" />${esc(f)}<small>${esc(TEAMS[i].short)}ファン</small></li>`).join("")}</ul>
          </div>
        </div>
      </section>
    </div>`,
};
