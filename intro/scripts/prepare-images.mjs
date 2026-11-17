// ロゴの背景切り抜きと、コンテンツ画像の WebP 変換を行う。
// 元画像を差し替えたら再実行： npm run images
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

sharp.cache(false);
const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public/assets");
// 元画像フォルダ（「イメージ　〇〇」）はリポジトリ直下にあり、紹介ページ・会員ページで共有する
const materials = path.resolve(root, "..");

/* ---------- 1. ロゴ：灰色の背景を切り抜く ---------- */
// 外周と、リング中央の穴を起点に「背景色に近い色」を塗りつぶし式に透明化する。
// （全体を色で抜くと、ボールの陰影まで消えてしまうため）
async function cutLogo() {
  const src = path.join(materials, "イメージ　アイコン/スクリーンショット 2026-11-17 114202.png");
  const { data, info } = await sharp(await fs.readFile(src)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => (y * w + x) * 4;
  const bg = [data[px(2, 2)], data[px(2, 2) + 1], data[px(2, 2) + 2]];
  const dist = (i) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
  const HARD = 22; // これ以下は完全に背景
  const SOFT = 48; // ここまでは縁として半透明

  const seen = new Uint8Array(w * h);
  const stack = [];
  const seed = (x, y) => { if (dist(px(x, y)) < HARD) stack.push([x, y]); };
  for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
  for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
  // リング中央の穴（画像中心付近で背景色の点を探す）
  for (let dy = -30; dy <= 30; dy += 3) for (let dx = -30; dx <= 30; dx += 3) seed(Math.round(w * 0.5) + dx, Math.round(h * 0.42) + dy);

  while (stack.length) {
    const [x, y] = stack.pop();
    const k = y * w + x;
    if (seen[k]) continue;
    const d = dist(k * 4);
    if (d >= SOFT) continue;
    seen[k] = 1;
    data[k * 4 + 3] = d < HARD ? 0 : Math.round(((d - HARD) / (SOFT - HARD)) * 255);
    if (d >= HARD) continue; // 縁で止める
    if (x > 0) stack.push([x - 1, y]);
    if (x < w - 1) stack.push([x + 1, y]);
    if (y > 0) stack.push([x, y - 1]);
    if (y < h - 1) stack.push([x, y + 1]);
  }
  const out = sharp(data, { raw: info }).trim({ threshold: 1 });
  const buf = await out.png().toBuffer();
  await sharp(buf).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(pub, "logo.webp"));
  await sharp(buf).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(root, "public/favicon.png"));
  const m = await sharp(buf).metadata();
  console.log("logo", m.width, m.height);
}

/* ---------- 2. コンテンツ画像 ---------- */
const CONTENT_IMAGES = {
  election: "OIP.webp",
  summit: "OIP (1).webp",
  film: "OIP (2).webp",
  cards: "OIP (3).webp",
  food: "OIP (4).webp",
  rental: "ダウンロード.webp",
};
async function contents() {
  await fs.mkdir(path.join(pub, "contents"), { recursive: true });
  for (const [id, file] of Object.entries(CONTENT_IMAGES)) {
    const b = await fs.readFile(path.join(materials, "イメージ　コンテンツ", file));
    await sharp(b).webp({ quality: 82 }).toFile(path.join(pub, "contents", `${id}.webp`));
    console.log("content", id);
  }
}

await cutLogo();
await contents();
