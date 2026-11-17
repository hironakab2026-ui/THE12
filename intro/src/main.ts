import "./styles/index.css";
import { bindReveals, setupFloatingButtons, setupIntro, setupMenu, setupSameHashLinks } from "./ui/effects";
import { renderStatic } from "./ui/render";
import { startRouter } from "./ui/router";

// CSS の読み込みが終わったのでページを表示する（index.html の is-ready を参照）
document.documentElement.classList.add("is-ready");

renderStatic();

const menu = setupMenu();
const updateButtons = setupFloatingButtons();

startRouter((view) => {
  menu.close();
  updateButtons(view);
  bindReveals();
});
setupSameHashLinks(() => window.dispatchEvent(new HashChangeEvent("hashchange")));
setupIntro();
