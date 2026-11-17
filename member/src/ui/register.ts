import { NAME_MAX } from "../config";
import { asset } from "../data/teams";
import { GUEST_PROFILE, state } from "../state";
import { session } from "../store";
import { $ } from "./dom";
import { nameError, profileFields, readForm } from "./profile-form";

export type RegisterResult = "member" | "guest" | "cancel";

/**
 * 初回登録（S-00）。
 * ユーザー名で利用者を識別し、同じ名前は登録できない（別の端末でも不可）。
 * 「ゲストとして見る」を選ぶと、登録なしで閲覧だけできる（投票はできない）。
 * fromGuest：ゲストが会員登録しに来たとき（ゲストボタンの代わりに「戻る」を出す）
 */
export function showRegister(fromGuest = false): Promise<RegisterResult> {
  return new Promise((resolve) => {
    const el = document.createElement("div");
    el.className = "register";
    el.innerHTML = `
      <div class="register__inner">
        <img class="register__logo" src="${asset("logo-v2.webp")}" width="150" height="120" alt="THE 12" />
        <p class="register__en">JOIN THE 12</p>
        <h1 class="register__title">はじめに、あなたのことを教えてください</h1>
        <p class="register__lead">入力はこの1回だけ。ユーザー名で、あなたの投票を記録します。</p>

        <form class="rform" novalidate>
          <label class="field">
            <span class="field__label">ユーザー名 <span class="req">必須</span></span>
            <input type="text" name="name" maxlength="${NAME_MAX}" autocomplete="nickname" placeholder="例：ナイター好き" required />
            <span class="field__hint">${NAME_MAX}文字以内。他の人と同じ名前は使えません。実名は使わないでください。</span>
          </label>
          ${profileFields({})}
          <p class="rform__err" role="alert" hidden></p>
          <button class="btn btn--primary btn--block btn--lg" type="submit">はじめる</button>
          ${
            fromGuest
              ? `<button class="btn btn--ghost btn--block" type="button" data-cancel>登録せずに戻る</button>`
              : `<div class="guestbox">
                   <p>まずは見てみたい方は</p>
                   <button class="btn btn--ghost btn--block" type="button" data-guest>ゲストとして見る</button>
                   <p class="field__hint">ゲストは閲覧のみで、総選挙への投票はできません。あとから会員登録できます。</p>
                 </div>`
          }
          <p class="rform__note">これは企画提案用のデモです。料金は一切かかりません。</p>
        </form>
      </div>`;
    document.body.append(el);
    document.body.classList.add("is-locked");
    const form = $<HTMLFormElement>("form", el)!;
    const err = $(".rform__err", el)!;
    const nameInput = $<HTMLInputElement>('input[name="name"]', el)!;
    nameInput.focus({ preventScroll: true });

    const done = (r: RegisterResult) => {
      el.remove();
      document.body.classList.remove("is-locked");
      resolve(r);
    };
    const fail = (msg: string) => {
      err.textContent = msg;
      err.hidden = false;
    };

    $("[data-guest]", el)?.addEventListener("click", () => {
      session.setGuest();
      state.me = { ...GUEST_PROFILE };
      state.votes = [];
      done("guest");
    });
    $("[data-cancel]", el)?.addEventListener("click", () => done("cancel"));

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
        state.me = { name, icon: v.icon, team: v.team };
        state.votes = [];
        done("member");
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
