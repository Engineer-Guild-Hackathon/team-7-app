# 環境構築
```bash
npm install # 依存関係のインストール

npm run dev # 開発サーバの立ち上げ(localhost:3000)
```

# ファイル構成
```
├── README.md
├── app
│   ├── api # API用のディレクトリ
│   ├── globals.css # 画面全体の配色やテーマ、UIの基本スタイルを定義するグローバルCSSファイル
│   ├── layout.tsx  # アプリ全体のレイアウトとメタデータ、グローバルスタイルを定義するルートコンポーネント
│   └── page.tsx    # 学習時間やアプリ使用状況を管理・可視化するダッシュボード画面のメインコンポーネント
├── components
│   ├── ai-feedback.tsx
│   ├── ai-goal-dialog.tsx  # AIと会話しながら目標を設定する
│   ├── app-management.tsx
│   ├── app-usage-chart.tsx
│   ├── category-management.tsx
│   ├── daily-report.tsx
│   ├── dashboard-overview.tsx
│   ├── goal-card.tsx
│   ├── goal-creation-dialog.tsx
│   ├── goal-overview.tsx
│   ├── goal-progress.tsx
│   ├── goal-roadmap.tsx
│   ├── goal-setting.tsx
│   ├── goal-subgoals.tsx
│   ├── settings-dialog.tsx # 設定画面の表示
│   ├── theme-provider.tsx # テーマ切り替え用プロバイダー
│   ├── time-distribution-chart.tsx # アプリごとの使用時間(円グラフの表示)
│   ├── ui # UIパーツ群
│   └── weekly-report.tsx # 週次の学習・使用状況レポートを表示
├── components.json
├── hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── styles
│   └── globals.css
└── tsconfig.json
```
