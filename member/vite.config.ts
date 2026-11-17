import { defineConfig } from "vite";

// 会員ページは https://<ユーザー名>.github.io/THE12/member/ に置く（紹介ページの下）。
// 画像（ロゴ・選手・コンテンツ・アイコン）は紹介ページの public/ を共有する。
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/THE12/member/" : "/",
  publicDir: "../intro/public",
  server: { port: 5174, strictPort: true },
}));
