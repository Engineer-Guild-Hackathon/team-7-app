"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Flag, CheckCircle2, Circle, Clock, Trophy } from "lucide-react"
import { useGoals } from "@/hooks/use-goals"

export function LearningRoadmap() {
  const { goals } = useGoals()

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            学習の道のり
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">目標を設定すると、学習の道のりが表示されます</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 全てのタスクを時系列順に並べて道のりを作成
  const roadmapItems = goals.flatMap((goal) =>
    goal.tasks.map((task, taskIndex) => ({
      id: `${goal.id}-${task.id}`,
      goalId: goal.id,
      goalTitle: goal.title,
      goalCategory: goal.category,
      taskTitle: task.title,
      taskIndex,
      totalTasks: goal.tasks.length,
      completed: task.completed,
      goalProgress: goal.progress,
      deadline: goal.deadline,
    })),
  )

  // 完了したタスクの数を計算
  const completedTasks = roadmapItems.filter((item) => item.completed).length
  const totalTasks = roadmapItems.length
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          学習の道のり
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>進捗: {overallProgress}%</span>
          <span>
            {completedTasks} / {totalTasks} タスク完了
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[400px]">
          {/* メインの道のり */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-muted-foreground/30 rounded-full"></div>

          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 rounded-full bg-yellow-300 relative">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-300"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-300"></div>
              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-yellow-300"></div>
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-yellow-300"></div>
            </div>
          </div>

          <div className="absolute top-8 right-20 opacity-60">
            <div className="flex items-end">
              <div className="w-4 h-3 bg-gray-200 rounded-full"></div>
              <div className="w-6 h-4 bg-gray-200 rounded-full -ml-1"></div>
              <div className="w-4 h-3 bg-gray-200 rounded-full -ml-1"></div>
            </div>
          </div>

          {/* スタート地点 */}
          <div className="relative flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center z-10 border-4 border-background shadow-lg">
              <Flag className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">学習スタート</h3>
              <p className="text-sm text-muted-foreground">あなたの成長の旅が始まります</p>
            </div>
          </div>

          {/* 各目標のセクション */}
          {goals.map((goal, goalIndex) => (
            <div key={goal.id} className="relative mb-8">
              {/* 目標のマイルストーン */}
              <div className="relative flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-background shadow-md ${
                    goal.progress >= 100
                      ? "bg-green-500"
                      : goal.progress > 0
                        ? "bg-yellow-500"
                        : "bg-muted-foreground/30"
                  }`}
                >
                  {goal.progress >= 100 ? (
                    <Trophy className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-white">{goalIndex + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-base">{goal.title}</h4>
                      <Badge variant={goal.progress >= 100 ? "default" : "secondary"}>{goal.progress}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{goal.category}</Badge>
                      <Badge variant="outline">{goal.difficulty}</Badge>
                      {goal.deadline && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(goal.deadline).toLocaleDateString("ja-JP")}
                        </div>
                      )}
                    </div>

                    {/* 進捗バー */}
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* タスクのチェックポイント */}
              <div className="ml-6 space-y-3">
                {goal.tasks.map((task, taskIndex) => (
                  <div key={task.id} className="relative flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 ${
                        task.completed ? "bg-green-500 border-green-500" : "bg-background border-muted-foreground/30"
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      ) : (
                        <Circle className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`flex-1 p-2 rounded ${
                        task.completed ? "bg-green-50 dark:bg-green-950/20" : "bg-muted/30"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          task.completed ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 目標間の接続線 */}
              {goalIndex < goals.length - 1 && (
                <div className="absolute left-8 -bottom-4 w-1 h-8 bg-gradient-to-b from-primary/60 to-primary/30"></div>
              )}
            </div>
          ))}

          {/* ゴール地点 */}
          <div className="relative flex items-center gap-4 mb-8">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center z-10 border-4 border-background shadow-lg ${
                overallProgress >= 100 ? "bg-green-500" : "bg-muted-foreground/30"
              }`}
            >
              <Trophy className={`w-8 h-8 ${overallProgress >= 100 ? "text-white" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h3
                className={`font-semibold text-lg ${overallProgress >= 100 ? "text-green-600" : "text-muted-foreground"}`}
              >
                {overallProgress >= 100 ? "🎉 全目標達成！" : "ゴール"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {overallProgress >= 100
                  ? "おめでとうございます！全ての学習目標を達成しました"
                  : "すべての目標を達成してゴールを目指しましょう"}
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 space-y-4">
            {/* コンパス */}
            <div className="bg-card border rounded-lg p-3 shadow-sm">
              <div className="w-12 h-12 rounded-full border-2 border-primary relative flex items-center justify-center">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-xs font-bold text-primary">
                  N
                </div>
                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                <div className="w-1 h-2 bg-gray-400 rounded-full absolute bottom-1"></div>
              </div>
            </div>

            {/* 凡例 */}
            <div className="bg-card border rounded-lg p-3 shadow-sm space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground">凡例</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">完了</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">進行中</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                  <span className="text-xs">未開始</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4">
            <div className="bg-card border rounded-lg p-2 shadow-sm">
              <div className="text-xs text-muted-foreground mb-1">進捗スケール</div>
              <div className="flex items-end gap-1">
                <div className="w-4 h-1 bg-primary"></div>
                <div className="w-4 h-2 bg-primary"></div>
                <div className="w-4 h-3 bg-primary"></div>
                <span className="text-xs ml-1">100%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
