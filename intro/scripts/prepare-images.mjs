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

/* ---------- 1. ロゴ（リング＋下の「The 12」の文字） ---------- */
// 元画像は背景が透明な PNG。余白を切り詰めて WebP とファビコンにする。
// ファビコンは小さく文字が読めないので、文字より上（リングだけ）を使う。
const RING_BOTTOM = 1230; // 元画像でリングと文字の間のすき間の行
async function cutLogo() {
  const src = path.join(materials, "イメージ　アイコン/Logo.png");
  const buf = await sharp(await fs.readFile(src)).trim({ threshold: 1 }).png().toBuffer();
  await sharp(buf).resize({ width: 900 }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(pub, "logo.webp"));
  const raw = await fs.readFile(src);
  const meta = await sharp(raw).metadata();
  const ring = await sharp(raw).extract({ left: 0, top: 0, width: meta.width, height: RING_BOTTOM }).png().toBuffer();
  const ringTrimmed = await sharp(ring).trim({ threshold: 1 }).png().toBuffer();
  await sharp(ringTrimmed).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(root, "public/favicon.png"));
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
  // ガチャ「私服ショット特集」の背景
  casual: "../イメージ　選手/images.jpg",
};
async function contents() {
  await fs.mkdir(path.join(pub, "contents"), { recursive: true });
  for (const [id, file] of Object.entries(CONTENT_IMAGES)) {
    const b = await fs.readFile(path.join(materials, "イメージ　コンテンツ", file));
    await sharp(b).webp({ quality: 82 }).toFile(path.join(pub, "contents", `${id}.webp`));
    console.log("content", id);
  }
}

/* ---------- 3. 白塗りの筆（キャッチコピーの「（　）」部分） ---------- */
// 元画像は「透明を表す市松模様」ごと JPG になっているため、色だけでは切り抜けない。
// 筆の部分は明るさ 244 の均一な色、市松模様は 255 と約 235 の繰り返しなので、
// 「周りもほぼ 244 で埋まっている画素」を筆とみなしてマスクを作る。
async function cutBrush() {
  const src = path.join(materials, "イメージ　コンテンツ/images.jpg");
  const { data, info } = await sharp(await fs.readFile(src)).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const BRUSH = 244, TOL = 3, R = 4; // 9×9 の範囲で判定
  const near = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) near[i] = Math.abs(data[i] - BRUSH) <= TOL ? 1 : 0;
  const mask = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let hit = 0, all = 0;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        all++; hit += near[yy * w + xx];
      }
      mask[y * w + x] = hit / all >= 0.75 ? 255 : 0;
    }
  }
  // 縁をなめらかにし、白一色の筆として書き出す（右下の透かし文字は筆の外なので入らない）
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) { rgba[i * 4] = 255; rgba[i * 4 + 1] = 255; rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = mask[i]; }
  const soft = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).blur(1.2).png().toBuffer();
  const out = await sharp(soft).trim({ threshold: 1 }).png().toBuffer();
  await sharp(out).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(pub, "brush.webp"));
  const m = await sharp(out).metadata();
  console.log("brush", m.width, m.height);
}

await cutLogo();
await contents();
await cutBrush();
