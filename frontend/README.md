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
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── ai-feedback.tsx
│   ├── ai-goal-dialog.tsx  # AIと会話しながら目標を設定する
│   ├── app-management.tsx
│   ├── app-usage-chart.tsx # アプリ別使用時間のカードを定義
│   ├── category-management.tsx
│   ├── daily-report.tsx
│   ├── dashboard-overview.tsx
│   ├── goal-card.tsx
│   ├── goal-creation-dialog.tsx
│   ├── goal-overview.tsx
│   ├── goal-progress.tsx
│   ├── goal-roadmap.tsx    # 目標設定タブの道のりを定義
│   ├── goal-setting.tsx
│   ├── goal-subgoals.tsx
│   ├── settings-dialog.tsx # 設定画面の表示
│   ├── theme-provider.tsx
│   ├── time-distribution-chart.tsx # アプリごとの使用時間(円グラフの表示)
│   ├── ui
│   └── weekly-report.tsx
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
