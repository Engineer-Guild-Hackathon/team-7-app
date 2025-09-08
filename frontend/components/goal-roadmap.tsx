"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
}

export function GoalRoadmap({ goal }: GoalRoadmapProps) {
    const completedSubGoals = goal.subGoals.filter((sub) => sub.completed).length
    const totalSubGoals = goal.subGoals.length

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
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted"></div>
            <div
                className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-500"
                style={{ height: `${(completedSubGoals / totalSubGoals) * 100}%` }}
            ></div>

            {/* Start Point */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Flag className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                <h3 className="font-semibold">スタート地点</h3>
                <p className="text-sm text-muted-foreground">
                    目標設定完了 - {new Date(goal.createdAt).toLocaleDateString("ja-JP")}
                </p>
                </div>
            </div>

            {/* Sub Goals as Milestones */}
            <div className="space-y-6 ml-6">
                {goal.subGoals.map((subGoal, index) => (
                <div key={subGoal.id} className="flex items-start gap-4">
                    <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        subGoal.completed ? "bg-primary border-primary" : "bg-background border-muted-foreground"
                    }`}
                    >
                    {subGoal.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    </div>
                    <div className="flex-1 pb-4">
                    <div className={`font-medium ${subGoal.completed ? "text-primary" : "text-foreground"}`}>
                        マイルストーン {index + 1}
                    </div>
                    <div
                        className={`text-sm ${subGoal.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
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
                    <Badge variant={subGoal.completed ? "default" : "secondary"} className="mt-2 text-xs">
                        {subGoal.completed ? "完了" : "進行中"}
                    </Badge>
                    </div>
                </div>
                ))}
            </div>

            {/* Goal Destination */}
            <div className="flex items-center gap-4 mt-6 ml-6">
                <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                    goal.progress === 100
                    ? "bg-green-500 border-green-500"
                    : "bg-background border-dashed border-muted-foreground"
                }`}
                >
                <Flag className={`h-6 w-6 ${goal.progress === 100 ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                <h3 className={`font-semibold ${goal.progress === 100 ? "text-green-600" : "text-foreground"}`}>
                    最終目標
                </h3>
                <p className="text-sm text-muted-foreground">{goal.outcome}</p>
                <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                    目標期限: {new Date(goal.deadline).toLocaleDateString("ja-JP")}
                    </span>
                </div>
                </div>
            </div>

            {/* Progress Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">全体の進捗</span>
                <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                {completedSubGoals} / {totalSubGoals} のマイルストーンが完了
                </div>
            </div>
            </div>
        </CardContent>
        </Card>
    )
}
