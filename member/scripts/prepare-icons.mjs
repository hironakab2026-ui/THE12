// 「イメージ　アイコン」の球団画像から、会員アイコン用の正方形 WebP を作る。
// 出力先は紹介ページと共有している intro/public/assets/icons/。
// 元画像を差し替えたら再実行： npm run icons
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

sharp.cache(false);
const root = path.resolve(import.meta.dirname, "..");
const src = path.resolve(root, "../イメージ　アイコン");
const out = path.resolve(root, "../intro/public/assets/icons");

/** 球団ID → 元画像ファイル名（src/data/teams.ts の id と対応） */
const FILES = {
  giants: "images (2).png",
  tigers: "images (1).jpg",
  baystars: "images (6).png",
  carp: "images (3).jpg",
  swallows: "images (7).png",
  dragons: "images (5).png",
  hawks: "original.avif",
  fighters: "images (3).png",
  marines: "CHIBA-LOTTE-MARINES-PETMARK-2019.11.01ol-2-2.jpg",
  eagles: "images (4).jpg",
  buffaloes: "images (2).jpg",
  lions: "images (1).png",
};

await fs.mkdir(out, { recursive: true });
for (const [id, file] of Object.entries(FILES)) {
  const input = await fs.readFile(path.join(src, file));
  // 白地の丸アイコンとして表示するので、白で余白を埋めて正方形にする
  await sharp(input)
    .flatten({ background: "#ffffff" })
    .trim({ threshold: 18 })
    .resize(176, 176, { fit: "contain", background: "#ffffff" })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: "#ffffff" })
    .webp({ quality: 86 })
    .toFile(path.join(out, `${id}.webp`));
  console.log(`icons/${id}.webp`);
}
