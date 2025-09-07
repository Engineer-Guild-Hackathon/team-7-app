import { GoalForm } from "@/components/goal-form"
import { Header } from "@/components/header"
import { ProgressDashboard } from "@/components/progress-dashboard"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              学習目標を設定して成長を可視化しよう
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              あなたの学習目標を設定し、進捗を追跡して目標達成への道のりを明確にしましょう
            </p>
          </div>

          <div className="mb-8">
            <ProgressDashboard />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <GoalForm />
            </div>

            
          </div>
        </div>
      </main>
    </div>
  )
}
