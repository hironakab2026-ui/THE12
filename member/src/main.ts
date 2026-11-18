import "./styles/member.css";
import { GUEST_PROFILE, state } from "./state";
import { createStore, session } from "./store";
import { toast } from "./ui/dom";
import { setupMenu } from "./ui/menu";
import { showRegister } from "./ui/register";
import { startTour } from "./ui/tour";
import { chooseView } from "./views/choose";
import { homeView } from "./views/home";
import { participateView } from "./views/participate";
import { previewView } from "./views/preview";
import { tasteView } from "./views/taste";
import type { View } from "./views/types";
import { watchView } from "./views/watch";

/**
 * ルーティング（# のあと）
 *   #/ ホーム ・ #/choose 選ぶ（メンバー総選挙。実際に記録されるのはここだけ）
 *   #/join 参加する（ファン首脳会議） ・ #/watch 見る ・ #/taste 味わう
 *   #/soon/{機能} まだ動かない機能のイメージ画面
 */
const ROUTES: Record<string, View> = {
  "": homeView,
  choose: chooseView,
  join: participateView,
  watch: watchView,
  taste: tasteView,
  soon: previewView,
};

const app = document.getElementById("app")!;
let current: View = homeView;

function render(): void {
  const key = location.hash.replace(/^#\/?/, "").split("/")[0];
  current = ROUTES[key] ?? homeView;
  document.body.dataset.view = key || "home";
  document.title = current === homeView ? "THE 12 — 会員ページ" : `${current.title} | THE 12 会員ページ`;
  // 画面ごとにイベントを付け直すため、要素ごと作り直す
  const root = document.createElement("div");
  root.className = "view";
  root.innerHTML = current.html();
  app.replaceChildren(root);
  current.bind?.(root);
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function main(): Promise<void> {
  document.documentElement.classList.add("is-ready");
  state.store = await createStore();
  state.me = null;
  state.tally = {};
  state.votes = [];

  // このブラウザで登録済みならその人として、ゲストならゲストとして開く
  const name = session.get();
  if (name) {
    try {
      state.me = await state.store.getProfile(name);
      if (state.me) state.votes = await state.store.myVotes(name);
      else session.clear(); // 記録がリセットされていた
    } catch (err) {
      console.error(err);
      toast("記録を読み込めませんでした。通信状況を確認してください。");
    }
  } else if (session.isGuest()) {
    state.me = { ...GUEST_PROFILE };
  }

  const menu = setupMenu(() => {
    menu.renderProfile();
    render();
  });

  // 全員の得票数（変わるたびに今の画面へ反映）
  state.store.watchTally((t) => {
    state.tally = t;
    const root = app.firstElementChild as HTMLElement | null;
    if (root) current.onTally?.(root);
  });

  window.addEventListener("hashchange", () => {
    menu.close();
    render();
  });

  // ゲストが「会員登録する」を押したとき
  window.addEventListener("the12:register", async () => {
    const res = await showRegister(true);
    if (res !== "member") return;
    menu.renderProfile();
    render();
    toast("会員登録しました。総選挙に投票できます。");
  });

  render();

  document.getElementById("mode-note")!.textContent =
    state.store.mode === "firebase" ? "記録はサーバーに保存され、全員で共有されます。" : "お試しモード：記録はこの端末の中だけに保存されます。";

  if (!state.me) {
    await showRegister();
    menu.renderProfile();
    location.hash = "#/";
    render();
    if (!session.tourDone()) await startTour();
  } else if (!session.tourDone()) {
    await startTour();
  }
}

void main();
