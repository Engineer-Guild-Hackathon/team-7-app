import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StudyTime Tracker',
  description: 'バックグラウンドでアクティブアプリを追跡し、使用時間をカテゴリ別に可視化。AIによる使用時間のフィードバックや、学習目標の設定・小目標管理も可能な学習サポートアプリ。',
  generator: 'StudyTime AI Tracker v0.1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={typeof document !== "undefined" ? document.documentElement.className : undefined}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
