# THE 12

NPB（日本野球機構）に向けた施策「THE 12」— 12球団をひとつに束ねた統一ファンクラブ — のWebサイト。
ADK内定者研修の企画提案用コンセプトサイトです。

**公開URL**
- 紹介ページ: https://hironakab2026-ui.github.io/THE12/
- 会員ページ（デモ）: https://hironakab2026-ui.github.io/THE12/member/

`main` に push すると GitHub Actions（`.github/workflows/deploy-intro.yml`）が紹介ページと会員ページをまとめてビルドして更新します。

## 構成

| フォルダ | 内容 | 状態 |
| --- | --- | --- |
| [`intro/`](intro/) | 紹介ページ（PR用ランディングページ） | 作成済み |
| [`member/`](member/) | 会員ページ（デモ）。動かし方・Firebase の設定は [`member/README.md`](member/README.md) | 作成済み |
| `イメージ　アイコン/` `イメージ　コンテンツ/` `イメージ　選手/` | 元画像（紹介ページ・会員ページで共有） | — |

## 紹介ページを動かす

```bash
cd intro
npm install
npm run dev
```

ブラウザで http://localhost:5173/ を開く。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発用サーバーを起動 |
| `npm run build` | 型チェック＋本番用ファイルを `intro/dist/` に出力 |
| `npm run images` | 元画像からロゴ・コンテンツ画像を作り直す |
| `npm run profiles` | 選手画像のシルエット形状を測り直す（選手画像を差し替えたとき） |

デザインの方針は [`intro/docs/STYLE_GUIDE.md`](intro/docs/STYLE_GUIDE.md) を参照。

## 注意

サイト内の写真（選手・観客・コンテンツ画像）はイメージ用の参考画像で、使用許諾を確認していません。
一般公開する場合は、使用許諾のある素材に差し替えてください。
