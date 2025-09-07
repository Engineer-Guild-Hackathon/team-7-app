"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Target, Calendar, Award, BookOpen, Clock, CheckCircle2 } from "lucide-react"
import { useGoals } from "@/hooks/use-goals"
import { LearningRoadmap } from "./learning-roadmap"

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function ProgressDashboard() {
  const { goals, isLoading, toggleTask } = useGoals()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">ダッシュボードを読み込み中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter((goal) => goal.progress >= 100).length
  const averageProgress =
    goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0

  const categoryData = goals.reduce(
    (acc, goal) => {
      const category = goal.category || "other"
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
    label:
      category === "programming"
        ? "プログラミング"
        : category === "design"
          ? "デザイン"
          : category === "language"
            ? "語学"
            : category === "business"
              ? "ビジネス"
              : category === "creative"
                ? "クリエイティブ"
                : "その他",
  }))

  const progressData = goals.map((goal) => ({
    name: goal.title.length > 15 ? goal.title.substring(0, 15) + "..." : goal.title,
    progress: goal.progress,
    deadline: goal.deadline,
  }))

  // 学習継続日数を計算（最初の目標作成日から現在まで）
  const learningDays =
    goals.length > 0
      ? Math.floor(
          (Date.now() - new Date(Math.min(...goals.map((g) => new Date(g.createdAt).getTime()))).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0

  return (
    <div className="space-y-6">
      {/* 概要統計 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総目標数</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground">設定済みの学習目標</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">達成済み</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals}</div>
            <p className="text-xs text-muted-foreground">完了した目標</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均進捗</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <p className="text-xs text-muted-foreground">全目標の平均進捗率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学習日数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningDays}</div>
            <p className="text-xs text-muted-foreground">継続学習日数</p>
          </CardContent>
        </Card>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">まだ目標が設定されていません</h3>
                <p className="text-muted-foreground">最初の学習目標を設定して、成長の旅を始めましょう！</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 左側：地図とチャート */}
            <div className="lg:col-span-2 space-y-6">
              <LearningRoadmap />

              {/* チャートセクション */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>目標別進捗状況</CardTitle>
                    <CardDescription>各目標の達成率を確認できます</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "進捗率"]}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                        <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>カテゴリー別分布</CardTitle>
                    <CardDescription>学習分野の内訳を表示します</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [value, "目標数"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="h-fit sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    設定済み目標
                  </CardTitle>
                  <CardDescription>現在の学習目標一覧</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[800px] overflow-y-auto">
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-3 space-y-3">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm leading-tight">{goal.title}</h3>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {goal.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {goal.difficulty}
                            </Badge>
                          </div>
                          {goal.deadline && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(goal.deadline).toLocaleDateString("ja-JP")}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>進捗</span>
                            <span className="font-medium">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-1.5" />
                          <div className="text-xs text-muted-foreground">
                            {goal.tasks.filter((t) => t.completed).length} / {goal.tasks.length} タスク完了
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-medium text-xs">タスク</h4>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {goal.tasks.slice(0, 3).map((task) => (
                              <div key={task.id} className="flex items-center gap-2 text-xs">
                                <button onClick={() => toggleTask(goal.id, task.id)} className="flex-shrink-0">
                                  <CheckCircle2
                                    className={`w-3 h-3 ${
                                      task.completed ? "text-primary fill-primary" : "text-muted-foreground"
                                    }`}
                                  />
                                </button>
                                <span
                                  className={`truncate ${
                                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                            ))}
                            {goal.tasks.length > 3 && (
                              <div className="text-xs text-muted-foreground pl-5">
                                +{goal.tasks.length - 3} その他のタスク
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
