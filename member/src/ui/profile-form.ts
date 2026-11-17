import { NO_TEAM, ICONS, TEAMS } from "../data/teams";
import { esc } from "./dom";

export const GENDERS = ["男性", "女性", "その他", "回答しない"];
export const AGES = ["10代", "20代", "30代", "40代", "50代", "60代", "70代以上"];

export interface FormValues {
  icon: string;
  team: string;
  gender: string;
  age: string;
}

/** アイコン・推し球団・性別・年代の入力欄（初回登録と登録内容の変更で共通） */
export const profileFields = (v: Partial<FormValues>): string => `
  <fieldset class="field">
    <legend class="field__label">アイコン <span class="req">必須</span></legend>
    <div class="icons">
      ${ICONS.map(
        (i) => `
        <label class="iconopt">
          <input type="radio" name="icon" value="${i.id}" ${(v.icon ?? "the12") === i.id ? "checked" : ""} />
          <img src="${i.src}" alt="" width="56" height="56" />
          <span>${esc(i.label)}</span>
        </label>`,
      ).join("")}
    </div>
  </fieldset>

  <fieldset class="field">
    <legend class="field__label">推し球団 <span class="req">必須</span></legend>
    <div class="teams">
      ${TEAMS.map(
        (t) => `
        <label class="teamopt">
          <input type="radio" name="team" value="${t.id}" ${v.team === t.id ? "checked" : ""} required />
          <span>${esc(t.short)}</span>
        </label>`,
      ).join("")}
      <label class="teamopt teamopt--none">
        <input type="radio" name="team" value="${NO_TEAM}" ${v.team === NO_TEAM ? "checked" : ""} />
        <span>まだ決めていない</span>
      </label>
    </div>
  </fieldset>

  <div class="field field--row">
    <label class="field__half">
      <span class="field__label">性別 <span class="opt">任意</span></span>
      <select name="gender">
        <option value="">選択しない</option>
        ${GENDERS.map((g) => `<option ${v.gender === g ? "selected" : ""}>${g}</option>`).join("")}
      </select>
    </label>
    <label class="field__half">
      <span class="field__label">年齢 <span class="opt">任意</span></span>
      <select name="age">
        <option value="">選択しない</option>
        ${AGES.map((a) => `<option ${v.age === a ? "selected" : ""}>${a}</option>`).join("")}
      </select>
    </label>
  </div>`;

export const readForm = (form: HTMLFormElement): FormValues => {
  const fd = new FormData(form);
  return {
    icon: String(fd.get("icon") ?? "the12"),
    team: String(fd.get("team") ?? ""),
    gender: String(fd.get("gender") ?? ""),
    age: String(fd.get("age") ?? ""),
  };
};

/** ユーザー名の確認。問題なければ null */
export function nameError(name: string, max: number): string | null {
  const n = [...name].length;
  if (n === 0) return "ユーザー名を入力してください。";
  if (n > max) return `ユーザー名は${max}文字以内にしてください。`;
  if (/[\/\\]/.test(name) || /^\.+$/.test(name) || name.startsWith("__")) return "この文字はユーザー名に使えません（/ や . だけの名前など）。";
  return null;
}
