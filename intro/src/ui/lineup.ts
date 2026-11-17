/**
 * ヒーローの12人ラインナップ。
 *
 * 写真の四角い枠どうしではなく「人のシルエット」どうしが触れない位置まで寄せて並べる。
 * バットや伸ばした腕の下の透明部分に隣の選手が入り込めるので、重ならずに大きく表示できる。
 *
 * 1. 中央の選手の高さを 1 として、各選手の高さ（山型の倍率）を決める
 * 2. 左から順に、既に置いた選手のシルエットに触れない最小の x に置く
 * 3. 全体の幅が枠に収まるよう、まとめて拡大縮小する
 */
import profilesJson from "../data/lineup-profiles.json";
import { LINEUP } from "../data/lineup";
import type { LineupPlayer } from "../types";
import { esc } from "./templates";

interface Profile {
  w: number;
  h: number;
  /** 下から上へ ROWS 分割した各行の、シルエット左端・右端（画像幅に対する割合） */
  left: (number | null)[];
  right: (number | null)[];
}

const PROFILES = profilesJson as Record<string, Profile>;
const IMG_DIR = `${import.meta.env.BASE_URL}assets/players/`;

/** 山型の倍率：中央 1.0 → 両端 0.4 まで一定の割合で小さく（外側を小さくするほど中央を大きくできる） */
const scaleAt = (dist: number, maxDist: number): number => 1 - 0.6 * (dist / maxDist);
/** 隣の選手とのすき間（中央の選手の高さに対する割合） */
const GAP = 0.015;
/** 高さ方向の当たり判定の細かさ */
const SAMPLES = 160;

interface Placed {
  p: LineupPlayer;
  prof: Profile;
  h: number; // 高さ（中央=1）
  w: number; // 幅
  x: number; // 左端
  dist: number;
}

/** 高さ y（床から）における、その選手のシルエットの左右端（絶対座標）。前後1行も含めて安全側に取る */
function edgesAt(o: Placed, y: number): [number, number] | null {
  if (y >= o.h) return null;
  const rows = o.prof.left.length;
  const r = Math.min(rows - 1, Math.floor((y / o.h) * rows));
  let l: number | null = null;
  let rt: number | null = null;
  for (let k = Math.max(0, r - 1); k <= Math.min(rows - 1, r + 1); k++) {
    const lk = o.prof.left[k];
    const rk = o.prof.right[k];
    if (lk !== null && (l === null || lk < l)) l = lk;
    if (rk !== null && (rt === null || rk > rt)) rt = rk;
  }
  if (l === null || rt === null) return null;
  return [o.x + l * o.w, o.x + rt * o.w];
}

/** 中央の高さ=1 の単位で全員の位置を決める */
function pack(): { placed: Placed[]; minX: number; maxX: number; maxH: number } {
  const center = (LINEUP.length - 1) / 2;
  const placed: Placed[] = [];

  for (const [i, p] of LINEUP.entries()) {
    const prof = PROFILES[p.file];
    const dist = Math.abs(i - center);
    const h = scaleAt(dist, center);
    const cur: Placed = { p, prof, h, w: (prof.w / prof.h) * h, x: 0, dist };

    let x = placed.length ? placed[placed.length - 1].x : 0;
    for (const prev of placed) {
      const top = Math.min(prev.h, cur.h);
      for (let s = 0; s < SAMPLES; s++) {
        const y = (s / SAMPLES) * top;
        const a = edgesAt(prev, y);
        const b = edgesAt({ ...cur, x: 0 }, y);
        if (a && b) x = Math.max(x, a[1] + GAP - b[0]);
      }
    }
    cur.x = x;
    placed.push(cur);
  }

  const minX = Math.min(...placed.map((o) => o.x));
  const maxX = Math.max(...placed.map((o) => o.x + o.w));
  const maxH = Math.max(...placed.map((o) => o.h));
  return { placed, minX, maxX, maxH };
}

const LAYOUT = pack();

/**
 * @param container 選手を並べる要素（.figs）
 * @param scene     選手に使える高さを決める要素（ヒーローの残りスペース）
 */
export function renderLineup(container: HTMLElement, scene: HTMLElement): void {
  const { placed, minX } = LAYOUT;
  container.innerHTML = placed
    .map((o, i) => {
      const z = Math.round(20 - o.dist * 2);
      const b = (1 - o.dist * 0.05).toFixed(2);
      // 登場アニメーション：中央の2人から外側へ順番に（左右対称に同時）
      const rank = Math.floor(o.dist);
      return `<div class="fig" data-i="${i}" style="--z:${z};--b:${b};--d:${(i * 0.35).toFixed(2)}s;--rank:${rank}">
        <img src="${IMG_DIR}${o.p.file}" width="${o.prof.w}" height="${o.prof.h}" alt="${esc(o.p.team)}の選手" decoding="async" />
      </div>`;
    })
    .join("");

  const figs = [...container.querySelectorAll<HTMLElement>(".fig")];
  const layout = () => {
    const { maxX, maxH } = LAYOUT;
    const totalW = maxX - minX;
    // 横幅いっぱい、かつヒーローの残りの高さ（scene）に収まる大きさ
    const unit = Math.min(container.clientWidth / totalW, scene.clientHeight / maxH);
    const offset = (container.clientWidth - totalW * unit) / 2;
    container.style.height = `${Math.round(maxH * unit)}px`;
    figs.forEach((el, i) => {
      const o = placed[i];
      el.style.left = `${offset + (o.x - minX) * unit}px`;
      el.style.width = `${o.w * unit}px`;
    });
  };

  layout();
  const ro = new ResizeObserver(layout);
  ro.observe(container);
  ro.observe(scene);
}
