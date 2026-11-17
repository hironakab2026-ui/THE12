import { state } from "../state";
import { $, esc, openModal, toast } from "./dom";
import { profileLine } from "./parts";
import { profileFields, readForm } from "./profile-form";

/**
 * 右上のハンバーガーメニュー（紹介ページと同じ見た目）。
 * 上部にアイコン・ユーザー名・グレード・推し球団を表示し、登録内容を変更できる。
 */
export function setupMenu(onProfileChange: () => void): { close: () => void; renderProfile: () => void } {
  const burger = $("#burger")!;
  const menu = $("#menu")!;
  const scrim = $("#menu-scrim")!;
  const prof = $("#menu-profile")!;

  const setOpen = (open: boolean) => {
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    scrim.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    menu.setAttribute("aria-hidden", String(!open));
  };

  const renderProfile = () => {
    const me = state.me;
    prof.innerHTML = !me
      ? ""
      : me.guest
        ? `${profileLine(me)}<button class="btn btn--primary btn--sm btn--block" type="button" data-register>会員登録する</button>`
        : `${profileLine(me)}<button class="btn btn--ghost btn--sm btn--block" type="button" id="edit-profile">登録内容を変更</button>`;
  };

  burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  scrim.addEventListener("click", () => setOpen(false));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
  // ホームのユーザー表示を押してもメニューを開く
  document.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("[data-open-menu]")) setOpen(true);
  });
  prof.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("#edit-profile")) {
      setOpen(false);
      editProfile(onProfileChange);
    }
    if ((e.target as HTMLElement).closest("[data-register]")) {
      setOpen(false);
      window.dispatchEvent(new Event("the12:register"));
    }
  });

  renderProfile();
  return { close: () => setOpen(false), renderProfile };
}

/** 登録内容の変更（ユーザー名は変えられない） */
function editProfile(onDone: () => void): void {
  const me = state.me;
  if (!me) return;
  void openModal(
    `<p class="modal__en">PROFILE</p>
     <h2 class="modal__title">登録内容を変更</h2>
     <p class="muted">ユーザー名（${esc(me.name)}）は変更できません。</p>
     <form class="rform rform--modal">
       ${profileFields({ icon: me.icon, team: me.team })}
       <p class="field__hint">性別・年齢は、変更するときだけ選んでください（前回の内容は表示されません）。</p>
       <div class="modal__btns">
         <button class="btn btn--ghost" type="button" data-close>やめる</button>
         <button class="btn btn--primary" type="submit">保存する</button>
       </div>
     </form>`,
    (box, close) => {
      const form = box.querySelector("form")!;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const v = readForm(form);
        const changedPriv = v.gender || v.age ? { gender: v.gender, age: v.age } : undefined;
        try {
          await state.store.updateProfile(me.name, { icon: v.icon, team: v.team || me.team }, changedPriv);
          me.icon = v.icon;
          me.team = v.team || me.team;
          close();
          toast("登録内容を保存しました");
          onDone();
        } catch (err) {
          console.error(err);
          toast("保存できませんでした。もう一度お試しください。");
        }
      });
    },
  );
}
