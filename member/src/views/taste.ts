import { ADS } from "../data/media";
import { asset } from "../data/teams";
import { pageHead } from "../ui/parts";
import { ads, ticker } from "../ui/ticker";
import type { View } from "./types";

const BOXES = [
  { href: "#/soon/gourmet", en: "GOURMET VOTE", jp: "グルメ投票", desc: "復刻してほしい、あの日の球場メシに1票", img: "contents/food.webp" },
  { href: "#/soon/delivery", en: "DELIVERY", jp: "Uber Eats で注文", desc: "球場の味を、家族の食卓へ", img: "crowd.webp" },
];

export const tasteView: View = {
  title: "味わう",
  html: () => `
    ${ticker(ads(ADS.taste), "復刻グルメ・ランキング・イベント")}
    <div class="page wrap">
      <a class="crumb" href="#/">← ホーム</a>
      ${pageHead("TASTE", "味わう", "懐かしの球場グルメを、球場でも、家でも。")}
      <div class="duo">
        ${BOXES.map(
          (b) => `
          <a class="tile tile--wide" href="${b.href}" style="--img:url('${asset(b.img)}')">
            <span class="tile__bg" aria-hidden="true"></span>
            <span class="tile__body">
              <span class="tile__en">${b.en}</span>
              <span class="tile__jp">${b.jp}</span>
              <span class="tile__desc">${b.desc}</span>
            </span>
          </a>`,
        ).join("")}
      </div>
    </div>`,
};
