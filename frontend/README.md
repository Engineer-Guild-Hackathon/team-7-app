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
│   ├── ai-feedback.tsx # AIによる学習フィードバックを表示するコンポーネント
│   ├── ai-goal-dialog.tsx  # AIとの対話を通じて学習目標を作成・登録できるダイアログコンポーネント
│   ├── app-management.tsx # アプリのカテゴリ管理・追加・削除を行うコンポーネント
│   ├── app-usage-chart.tsx # アプリ別使用時間のカードを定義
│   ├── category-management.tsx # カテゴリの追加・色変更・削除を管理するコンポーネント
│   ├── daily-report.tsx # 日次の学習・使用状況レポートを表示
│   ├── dashboard-overview.tsx  # ダッシュボードタブの「今日の勉強時間」「勉強効率」「総勉強時間」を定義
│   ├── goal-card.tsx # 目標の詳細・進捗・小目標を表示するカード
│   ├── goal-creation-dialog.tsx # 目標作成用ダイアログ
│   ├── goal-overview.tsx # 目標の概要情報を表示
│   ├── goal-progress.tsx # 目標の進捗状況を表示
│   ├── goal-roadmap.tsx    # 目標設定タブの道のりを定義
│   ├── goal-setting.tsx # 目標設定画面のメインコンポーネント
│   ├── goal-subgoals.tsx # 小目標の一覧・進捗管理
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
