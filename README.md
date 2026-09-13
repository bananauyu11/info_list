# PMO情報整理・交通整理アプリ

会議・チャット・資料・会話から得た情報を数秒で記録し、後から整理できるアプリです。
「情報を管理するためのアプリ」ではなく「情報を使って仕事を前に進めるためのアプリ」を目指しています。

## 主な機能（MVP）

- ＋情報を追加：内容だけで即登録、詳細（対象・カテゴリー・重要度・理解深度・今やること等）は任意
- 情報整理一覧：検索・フィルター（未整理／重要度未判定／理解度Lv.1／深掘り等）
- 未整理ビュー：未整理の情報をカード形式で順番に処理
- CSVインポート／エクスポート：プレビュー・行単位のエラー表示、UTF-8 BOM付き
- 会議モード：論点／事実・前提／未決事項／決定事項／Next Actionを1画面で整理
- Next Action：担当者・期限・ステータス管理、情報・会議との相互リンク
- ホーム画面に追加（PWA）：スマホでアプリのようにアイコンから起動可能

## 技術構成

- [Next.js](https://nextjs.org)（App Router） + TypeScript + Tailwind CSS
- [Prisma ORM](https://www.prisma.io) + PostgreSQL（`@prisma/adapter-pg`）— Vercelでの本番運用を想定
- データ取得: [SWR](https://swr.vercel.app)
- CSV処理: [PapaParse](https://www.papaparse.com)
- バリデーション: [Zod](https://zod.dev)

## ローカル開発セットアップ

PostgreSQL（またはPostgreSQL互換）データベースが必要です。手軽なのは Prisma純正のローカル開発用DBです。

```bash
cp .env.example .env

# 1. ローカルDBを起動（別ターミナルで常駐させる）
npm run db:dev
# 起動時に表示される接続文字列を .env の DATABASE_URL に設定してください

# 2. 依存関係インストール（postinstallでprisma generateも自動実行）
npm install

# 3. マイグレーション適用
npm run db:migrate

# 4. 開発サーバー起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

すでに手元にPostgreSQL（Docker等）がある場合は `npm run db:dev` の代わりに
その接続文字列を `DATABASE_URL` に設定するだけで構いません。

## Vercelへのデプロイ

このアプリはVercelでの運用を想定しています。

1. リポジトリをVercelにインポートする（Next.jsとして自動検出されます）。
2. Postgres系のデータベースを用意し、接続文字列を取得する。
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)（Vercelダッシュボードの Storage タブから作成）
   - [Neon](https://neon.tech) / [Supabase](https://supabase.com) など、他のマネージドPostgresでも可
3. Vercelプロジェクトの環境変数に `DATABASE_URL` を設定する（プールド接続文字列を推奨）。
4. デプロイを実行する。`npm run build` は `prisma migrate deploy && next build` を実行するため、
   デプロイのたびに未適用のマイグレーションが自動的に本番DBへ反映されます。

`better-sqlite3` のようなネイティブファイル依存を持たないため、Vercelのサーバーレス関数上でも
そのまま動作します。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | `prisma migrate deploy` を実行してから本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint実行 |
| `npm run db:dev` | ローカル用Prisma Postgresサーバーを起動 |
| `npm run db:migrate` | Prismaマイグレーション作成・適用（開発用） |
| `npm run db:deploy` | Prismaマイグレーション適用（本番用） |

## データ

データベースへの書き込みが正となりますが、いつでも「設定」画面またはCSVエクスポート機能で
全件のバックアップを取得できます。CSVインポートで別環境への移行も可能です。
