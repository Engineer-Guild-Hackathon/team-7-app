"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, MapPin, Flag, Calendar } from "lucide-react"

interface Goal {
    id: string
    title: string
    reason: string
    outcome: string
    scope: string
    deadline: string
    progress: number
    subGoals: SubGoal[]
    createdAt: string
}

interface SubGoal {
    id: string
    title: string
    completed: boolean
    dueDate: string
}

interface GoalRoadmapProps {
    goal: Goal
    onToggleSubGoal: (goalId: string, subGoalId: string) => void
}

export function GoalRoadmap({ goal, onToggleSubGoal }: GoalRoadmapProps) {
    const completedSubGoals = goal.subGoals.filter((sub) => sub.completed).length
    const totalSubGoals = goal.subGoals.length
    const totalSteps = totalSubGoals + 1;
    const achievedSteps = completedSubGoals + (goal.progress === 100 ? 1 : 0);
    const progress = (achievedSteps / totalSteps) * 100

    return (
        <Card className="w-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {goal.title} - 達成への道のり
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="relative">
            {/* 灰色の全体ライン */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />

            {/* 青い進捗ライン */}
            <div
                className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-500"
                style={{
                height: `calc(${progress}% - 2.5rem - 7.5rem)` // スタート地点の高さ分を引く
                }}
            />

            <div className="flex flex-col items-start">
                {/* スタート地点 */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Flag className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">スタート地点</h3>
                    <p className="text-sm text-muted-foreground">
                    目標設定完了 - {new Date(goal.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                </div>
                </div>

                {/* マイルストーン */}
                <div className="space-y-6 ml-6">
                {goal.subGoals.map((subGoal, index) => (
                    <div key={subGoal.id} className="flex items-start gap-4 relative z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative z-10 w-8 h-8 p-0 rounded-full hover:bg-transparent"
                        onClick={() => onToggleSubGoal(goal.id, subGoal.id)}
                    >
                        <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                            subGoal.completed
                            ? "bg-primary border-primary hover:bg-primary/90"
                            : "bg-background border-muted-foreground hover:border-primary hover:bg-primary/10"
                        }`}
                        >
                        {subGoal.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                        ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        </div>
                    </Button>
                    <div className="flex-1 pb-4">
                        <div
                        className={`font-medium ${
                            subGoal.completed ? "text-primary" : "text-foreground"
                        }`}
                        >
                        マイルストーン {index + 1}
                        </div>
                        <div
                        className={`text-sm ${
                            subGoal.completed ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                        >
                        {subGoal.title}
                        </div>
                        {subGoal.dueDate && (
                        <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                            {new Date(subGoal.dueDate).toLocaleDateString("ja-JP")}
                            </span>
                        </div>
                        )}
                        <Badge
                        variant={subGoal.completed ? "default" : "secondary"}
                        className="mt-2 text-xs"
                        >
                        {subGoal.completed ? "完了" : "進行中"}
                        </Badge>
                        <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 mt-2 h-6 text-xs bg-transparent"
                        onClick={() => onToggleSubGoal(goal.id, subGoal.id)}
                        >
                        {subGoal.completed ? "未完了にする" : "完了にする"}
                        </Button>
                    </div>
                    </div>
                ))}
                </div>

                {/* 最終目標 */}
                <div className="flex items-center gap-4 mt-6 ml-6 relative z-10">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                    goal.progress === 100
                        ? "bg-green-500 border-green-500"
                        : "bg-background border-dashed border-muted-foreground"
                    }`}
                >
                    <Flag
                    className={`h-6 w-6 ${
                        goal.progress === 100 ? "text-white" : "text-muted-foreground"
                    }`}
                    />
                </div>
                <div className="flex-1">
                    <h3
                    className={`font-semibold ${
                        goal.progress === 100 ? "text-green-600" : "text-foreground"
                    }`}
                    >
                    最終目標
                    </h3>
                    <p className="text-sm text-muted-foreground">{goal.outcome}</p>
                    <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        目標期限: {new Date(goal.deadline).toLocaleDateString("ja-JP")}
                    </span>
                    </div>

                    {/* 完了切り替えボタン */}
                    <div className="flex items-center gap-2 mt-2">
                        <Badge
                            variant={goal.progress === 100 ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {goal.progress === 100 ? "完了" : "進行中"}
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs bg-transparent"
                            onClick={() => onToggleSubGoal(goal.id, "final")}
                        >
                            {goal.progress === 100 ? "未完了にする" : "完了にする"}
                        </Button>
                    </div>
                </div>
                </div>

                {/* Progress Summary */}
                <div className="mt-6 p-4 bg-muted rounded-lg w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">全体の進捗</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                    {achievedSteps} / {totalSteps} のマイルストーンが完了
                </div>
                </div>
            </div>
            </div>
        </CardContent>
        </Card>
    )
}
