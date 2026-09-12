# PMO情報整理・交通整理アプリ

会議・チャット・資料・会話から得た情報を数秒で記録し、後から整理できるアプリです。
「情報を管理するためのアプリ」ではなく「情報を使って仕事を前に進めるためのアプリ」を目指しています。

## 主な機能（MVP）

- ＋情報を追加：内容だけで即登録、詳細（対象・カテゴリー・重要度・理解深度・今やること等）は任意
- 情報一覧：検索・フィルター（未整理／重要度未判定／理解度Lv.1／深掘り等）
- 未整理ビュー：未整理の情報をカード形式で順番に処理
- CSVインポート／エクスポート：プレビュー・行単位のエラー表示、UTF-8 BOM付き
- 会議モード：論点／事実・前提／未決事項／決定事項／Next Actionを1画面で整理
- Next Action：担当者・期限・ステータス管理、情報・会議との相互リンク

## 技術構成

- [Next.js](https://nextjs.org)（App Router） + TypeScript + Tailwind CSS
- [Prisma ORM](https://www.prisma.io) + SQLite（`@prisma/adapter-better-sqlite3`）
- データ取得: [SWR](https://swr.vercel.app)
- CSV処理: [PapaParse](https://www.papaparse.com)
- バリデーション: [Zod](https://zod.dev)

## セットアップ

```bash
cp .env.example .env  # DATABASE_URL を設定
npm install            # postinstall で prisma generate が自動実行されます
npm run db:migrate     # 初回のみ：SQLiteデータベースを作成
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint実行 |
| `npm run db:migrate` | Prismaマイグレーション（開発用） |
| `npm run db:deploy` | Prismaマイグレーション（本番適用） |

## データ

SQLiteのデータベースファイル（`dev.db`）はGit管理対象外です。データのバックアップ・移行は
「設定」画面またはCSVエクスポート機能を使用してください。
