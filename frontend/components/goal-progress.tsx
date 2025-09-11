"use client"

import { Progress } from "@/components/ui/progress"

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

interface GoalProgressProps {
    goal: Goal
}

export function GoalProgress({ goal }: GoalProgressProps) {
    return (
        <div className="space-y-4">
        <div>
            <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">全体の進捗</span>
            <span className="text-sm text-muted-foreground">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{goal.subGoals.filter((sub) => sub.completed).length}</div>
            <div className="text-sm text-muted-foreground">完了済み</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-500">
                {goal.subGoals.filter((sub) => !sub.completed).length}
            </div>
            <div className="text-sm text-muted-foreground">残り</div>
            </div>
        </div>
        </div>
    )
}
