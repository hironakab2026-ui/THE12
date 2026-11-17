import { CURRENT_12 } from "../data/candidates";
import { VIDEOS } from "../data/media";
import { TEAMS, asset, teamIcon, teamLabel } from "../data/teams";
import { esc } from "../ui/dom";
import { pageHead } from "../ui/parts";
import type { View } from "./types";

/**
 * まだ動かない機能の「イメージ画面」。
 * 実現したときにどんな画面・体験になるかを、ダミーの中身で見せる（操作しても記録はされない）。
 * #/soon/{id}（動画は #/soon/video/{動画ID}）
 */

const imageNote = (): string =>
  `<p class="mock-note"><b>公開準備中</b>この画面はイメージです。実際の機能は今後追加されます。</p>`;

/** イメージ用のトレカ */
const sampleCard = (i: number, kind: string, rarity: "N" | "R" | "SR", extra = ""): string => {
  const p = CURRENT_12[i % 12];
  const t = TEAMS[i % 12];
  return `
    <figure class="tcard tcard--${rarity.toLowerCase()}">
      <span class="tcard__rarity">${rarity}</span>
      <img class="tcard__img" src="${asset(`players/${t.player}`)}" alt="" loading="lazy" />
      <img class="tcard__logo" src="${teamIcon(t.id)}" alt="" />
      <figcaption class="tcard__cap">
        <span class="tcard__kind">${esc(kind)}</span>
        <span class="tcard__name">${esc(p.name)}</span>
        <span class="tcard__team">${esc(t.short)}</span>
      </figcaption>
      ${extra}
    </figure>`;
};

const KINDS: [string, "N" | "R" | "SR"][] = [["レギュラー", "N"], ["私服ショット", "R"], ["同期対決ペアショット", "SR"]];

interface Preview {
  title: string;
  en: string;
  lead: string;
  back: { href: string; label: string };
  body: (arg: string) => string;
}

const PREVIEWS: Record<string, Preview> = {
  gacha: {
    title: "ガチャ",
    en: "GACHA",
    lead: "ボタンを押すとカードが1枚ずつめくれ、引いたカードはコレクションに追加されます。",
    back: { href: "#/collect", label: "集める" },
    body: () => `
      <p class="mock-cap">10回引いたときのイメージ</p>
      <div class="pulls pulls--many">
        ${[0, 3, 6, 1, 9, 4, 11, 7, 2, 5]
          .map((n, i) => {
            const [kind, r] = KINDS[i === 2 ? 2 : i % 4 === 1 ? 1 : 0];
            return `<div class="pull" style="--i:${i}">${sampleCard(n, kind, r, i < 4 ? `<span class="tcard__new">NEW</span>` : "")}</div>`;
          })
          .join("")}
      </div>
      <ul class="feat">
        <li><strong>PICK UP</strong>：期間限定のテーマ（例：私服ショット特集）。対象カードが出やすくなる</li>
        <li><strong>NORMAL</strong>：12球団・全36種類から出る、いつでも引けるガチャ</li>
        <li>会員特典や、球場でのチェックインでも引けるようになる予定</li>
      </ul>`,
  },
  collection: {
    title: "コレクション",
    en: "COLLECTION",
    lead: "集めたカードが図鑑のように並びます。★を付けたお気に入りのカードは、いちばん前に表示されます。",
    back: { href: "#/collect", label: "集める" },
    body: () => `
      <p class="dexsum"><b>9</b> / 36 種類　<span class="muted">★のカードが先頭、ほかは手に入れた順</span></p>
      <div class="cgrid">
        ${[
          [1, 1, true, 1],
          [4, 2, true, 1],
          [0, 0, false, 3],
          [6, 0, false, 1],
          [9, 1, false, 2],
          [2, 0, false, 1],
          [11, 0, false, 1],
          [7, 1, false, 1],
          [3, 0, false, 1],
        ]
          .map(([n, k, fav, count]) => {
            const [kind, r] = KINDS[k as number];
            return `<div class="cslot">${sampleCard(
              n as number,
              kind,
              r,
              `<span class="fav${fav ? " is-on" : ""}" aria-hidden="true">★</span>${(count as number) > 1 ? `<span class="tcard__count">×${count}</span>` : ""}`,
            )}</div>`;
          })
          .join("")}
        ${Array.from({ length: 9 }, () => `<div class="cslot cslot--empty" aria-hidden="true"><span>?</span></div>`).join("")}
      </div>`,
  },
  video: {
    title: "動画",
    en: "PLAYER",
    lead: "選んだ動画をその場で再生。移動時間に合わせて、続きから見ることもできます。",
    back: { href: "#/watch", label: "見る" },
    body: (id) => {
      const v = VIDEOS.find((x) => x.id === id) ?? VIDEOS[0];
      const more = VIDEOS.filter((x) => x.id !== v.id).slice(0, 3);
      return `
      <div class="player" style="--img:url('${v.thumb}')">
        <span class="player__play" aria-hidden="true">▶</span>
        <span class="player__bar"><span style="width:32%"></span></span>
        <span class="player__time">${Math.round(v.minutes * 0.32)}:12 / ${v.minutes}:00</span>
      </div>
      <h2 class="player__title">${esc(v.title)}</h2>
      <p class="muted">${v.date.replace(/-/g, ".")} 公開予定 ・ ${v.minutes}分</p>
      <p class="body-text">THE 12 の選手に密着した、会員限定の映像です。試合では見られない素顔や、チームメイトとの会話、オフの過ごし方まで。通勤や移動の数分でも楽しめるよう、短いチャプターに分かれています。</p>
      <h3 class="h-sub">チャプター</h3>
      <ol class="history">${["オープニング", "グラウンドの外で", "ライバルとの対話", "来季への約束"]
        .map((c, i) => `<li><time>${String(i * Math.max(1, Math.floor(v.minutes / 4))).padStart(2, "0")}:00</time><span>${c}</span></li>`)
        .join("")}</ol>
      <h3 class="h-sub">次に見る</h3>
      <ul class="next">${more.map((m) => `<li><a href="#/soon/video/${m.id}"><span class="next__thumb" style="--img:url('${m.thumb}')"></span><span>${esc(m.title)}<small>${m.minutes}分</small></span></a></li>`).join("")}</ul>`;
    },
  },
  gourmet: {
    title: "グルメ投票",
    en: "GOURMET VOTE",
    lead: "復刻してほしい「あの日の球場メシ」に投票。上位のメニューが、実際に球場で復刻されます。",
    back: { href: "#/taste", label: "味わう" },
    body: () => {
      const menu = [
        ["昭和の球場カレー", "甲子園", 1284],
        ["レジェンドの好物 焼きそば", "東京ドーム", 1102],
        ["名物 もつ煮込み", "マツダスタジアム", 876],
        ["ジャンボ唐揚げ弁当", "横浜スタジアム", 640],
        ["手羽先の甘辛だれ", "バンテリンドーム", 512],
      ] as const;
      const max = menu[0][2];
      return `
      <ol class="ranklist">
        ${menu
          .map(
            ([name, place, n], i) => `
          <li class="rankitem">
            <span class="rankitem__no">${i + 1}</span>
            <span class="rankitem__body"><b>${name}</b><small>${place}</small><span class="rankitem__bar" style="--w:${(n / max) * 100}%"></span></span>
            <span class="rankitem__n">${n.toLocaleString()}票</span>
            <span class="btn btn--ghost btn--sm" aria-hidden="true">投票</span>
          </li>`,
          )
          .join("")}
      </ol>`;
    },
  },
  delivery: {
    title: "Uber Eats で注文",
    en: "DELIVERY",
    lead: "球場の味を、家族の食卓へ。試合中継を見ながら、球場グルメを家で楽しめます。",
    back: { href: "#/taste", label: "味わう" },
    body: () => `
      <div class="menu-grid">
        ${[
          ["復刻 昭和の球場カレー", "甲子園", 980, "contents/food.webp"],
          ["レジェンドの焼きそば", "東京ドーム", 850, "crowd.webp"],
          ["親子で分けるファミリーセット", "全球場", 2480, "contents/rental.webp"],
        ]
          .map(
            ([name, place, price, img]) => `
          <div class="dish">
            <span class="dish__img" style="--img:url('${asset(String(img))}')"></span>
            <span class="dish__body"><b>${name}</b><small>${place}の味</small><span class="dish__price">¥${Number(price).toLocaleString()}</span></span>
            <span class="btn btn--ghost btn--sm" aria-hidden="true">カートに入れる</span>
          </div>`,
          )
          .join("")}
      </div>
      <p class="muted">お届け目安：30〜45分 ・ 注文は Uber Eats のアプリで行います</p>`,
  },
  ticket: {
    title: "チケット早期購入",
    en: "EARLY TICKETS",
    lead: "会員は12球団の試合チケットを、一般発売より先に購入できます。",
    back: { href: "#/", label: "ホーム" },
    body: () => `
      <ul class="tlist">
        ${[
          ["tigers", "giants", "2027.3.27（土）18:00", "東京ドーム", "12/1 10:00〜"],
          ["carp", "dragons", "2027.3.28（日）13:00", "バンテリンドーム", "12/1 10:00〜"],
          ["hawks", "lions", "2027.4.2（金）18:00", "ベルーナドーム", "12/8 10:00〜"],
          ["marines", "fighters", "2027.4.3（土）14:00", "エスコンフィールド", "12/8 10:00〜"],
        ]
          .map(
            ([a, h, date, place, sale]) => `
          <li class="tlist__item">
            <span class="tlist__teams"><img src="${teamIcon(a)}" alt="" width="28" height="28" />${teamLabel(a)} <small>vs</small> ${teamLabel(h)}<img src="${teamIcon(h)}" alt="" width="28" height="28" /></span>
            <span class="tlist__info">${date} ・ ${place}</span>
            <span class="tlist__sale">会員先行 ${sale}</span>
          </li>`,
          )
          .join("")}
      </ul>`,
  },
  points: {
    title: "ポイントクラブ",
    en: "POINT CLUB",
    lead: "球場での買い物や来場でポイントがたまり、グッズやフードに使えます。",
    back: { href: "#/", label: "ホーム" },
    body: () => `
      <div class="pcard">
        <p class="pcard__en">THE 12 POINT CLUB</p>
        <p class="pcard__pt"><b>1,250</b> pt</p>
        <p class="pcard__sub">会員証のQRコードを、球場の売店で見せるだけ</p>
      </div>
      <ul class="feat">
        <li><strong>来場</strong>：球場でチェックインすると 100pt</li>
        <li><strong>お買い物</strong>：球場グルメ・グッズ 100円ごとに 1pt</li>
        <li><strong>使う</strong>：1pt＝1円として12球場の売店で使える</li>
      </ul>`,
  },
};

export const previewView: View = {
  title: "イメージ",
  html: () => {
    const [, id = "", arg = ""] = location.hash.replace(/^#\/?/, "").split("/");
    const p = PREVIEWS[id];
    if (!p) {
      return `
      <div class="page wrap">
        ${pageHead("COMING SOON", "公開準備中", "この機能は今後追加されます。")}
        <div class="btnrow"><a class="btn btn--ghost" href="#/">ホームへ</a></div>
      </div>`;
    }
    return `
    <div class="page wrap">
      <a class="crumb" href="${p.back.href}">← ${esc(p.back.label)}</a>
      ${pageHead(p.en, p.title, p.lead)}
      ${imageNote()}
      <div class="mock">${p.body(arg)}</div>
    </div>`;
  },
};
