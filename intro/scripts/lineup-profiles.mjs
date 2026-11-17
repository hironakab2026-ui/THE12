// 選手画像の「シルエットの左右端」を高さ方向に測り、src/data/lineup-profiles.json に保存する。
// 画像を差し替えたら再実行： node scripts/lineup-profiles.mjs
// ※ sharp が必要（npm i -D sharp）。サイト本体の実行には不要。
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROWS = 64; // 高さ方向の分割数（下から上）
const ALPHA = 96; // これ以上の不透明度を「人がいる」とみなす

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public/assets/players");
const out = {};
sharp.cache(false);

for (const f of (await fs.readdir(dir)).filter((x) => x.endsWith(".webp")).sort()) {
  const { data, info } = await sharp(await fs.readFile(path.join(dir, f)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const left = new Array(ROWS).fill(null);
  const right = new Array(ROWS).fill(null);
  for (let y = 0; y < h; y++) {
    const r = Math.min(ROWS - 1, Math.floor(((h - 1 - y) / h) * ROWS)); // 下から数えた行
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < ALPHA) continue;
      const fx = x / w;
      if (left[r] === null || fx < left[r]) left[r] = fx;
      if (right[r] === null || fx > right[r]) right[r] = (x + 1) / w;
    }
  }
  const round = (v) => (v === null ? null : Math.round(v * 1000) / 1000);
  out[f] = { w, h, left: left.map(round), right: right.map(round) };
  console.log(f, w, h);
}

await fs.writeFile(path.join(root, "src/data/lineup-profiles.json"), JSON.stringify(out));
