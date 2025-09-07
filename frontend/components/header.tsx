import { Target, TrendingUp } from "lucide-react"

export function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">学習目標アプリ</h1>
              <p className="text-sm text-muted-foreground">目標設定と進捗管理</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>成長を可視化</span>
          </div>
        </div>
      </div>
    </header>
  )
}
