import { defineConfig } from "vite";

// GitHub Pages では https://<ユーザー名>.github.io/THE12/ に置かれるため、
// 本番ビルドのときだけ公開パスを /THE12/ にする（開発中は / のまま）
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/THE12/" : "/",
}));
