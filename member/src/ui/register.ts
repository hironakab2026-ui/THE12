import { NAME_MAX } from "../config";
import { asset } from "../data/teams";
import { state } from "../state";
import { session } from "../store";
import { $ } from "./dom";
import { nameError, profileFields, readForm } from "./profile-form";

/**
 * 初回登録（S-00）。登録が終わったら resolve する。
 * ユーザー名で利用者を識別し、同じ名前は登録できない（別の端末でも不可）。
 */
export function showRegister(): Promise<void> {
  return new Promise((resolve) => {
    const el = document.createElement("div");
    el.className = "register";
    el.innerHTML = `
      <div class="register__inner">
        <img class="register__logo" src="${asset("logo.webp")}" width="150" height="100" alt="THE 12" />
        <p class="register__en">JOIN THE 12</p>
        <h1 class="register__title">はじめに、あなたのことを教えてください</h1>
        <p class="register__lead">入力はこの1回だけ。ユーザー名で、あなたの投票やカードを記録します。</p>

        <form class="rform" novalidate>
          <label class="field">
            <span class="field__label">ユーザー名 <span class="req">必須</span></span>
            <input type="text" name="name" maxlength="${NAME_MAX}" autocomplete="nickname" placeholder="例：ナイター好き" required />
            <span class="field__hint">${NAME_MAX}文字以内。他の人と同じ名前は使えません。実名は使わないでください。</span>
          </label>
          ${profileFields({})}
          <p class="rform__err" role="alert" hidden></p>
          <button class="btn btn--primary btn--block btn--lg" type="submit">はじめる</button>
          <p class="rform__note">これは企画提案用のデモです。料金は一切かかりません。</p>
        </form>
      </div>`;
    document.body.append(el);
    document.body.classList.add("is-locked");
    const form = $<HTMLFormElement>("form", el)!;
    const err = $(".rform__err", el)!;
    const nameInput = $<HTMLInputElement>('input[name="name"]', el)!;
    nameInput.focus();

    const fail = (msg: string) => {
      err.textContent = msg;
      err.hidden = false;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const v = readForm(form);
      const ne = nameError(name, NAME_MAX);
      if (ne) return fail(ne);
      if (!v.team) return fail("推し球団を選んでください（「まだ決めていない」も選べます）。");
      const btn = $<HTMLButtonElement>('button[type="submit"]', form)!;
      btn.disabled = true;
      btn.textContent = "登録しています…";
      try {
        const res = await state.store.register({ name, icon: v.icon, team: v.team }, { gender: v.gender, age: v.age });
        if (res === "taken") {
          fail(`「${name}」はすでに使われています。別のユーザー名にしてください。`);
          return;
        }
        session.set(name);
        state.me = { name, icon: v.icon, team: v.team, favs: [] };
        state.votes = [];
        state.cards = [];
        el.remove();
        document.body.classList.remove("is-locked");
        resolve();
      } catch (ex) {
        console.error(ex);
        fail("登録できませんでした。通信状況を確認して、もう一度お試しください。");
      } finally {
        btn.disabled = false;
        btn.textContent = "はじめる";
      }
    });
  });
}
