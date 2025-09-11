"use client"

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

interface GoalOverviewProps {
    goal: Goal
}

export function GoalOverview({ goal }: GoalOverviewProps) {
    return (
        <div className="grid gap-4">
        <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">達成したい理由</h4>
            <p className="text-sm">{goal.reason}</p>
        </div>
        <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">達成後の目標</h4>
            <p className="text-sm">{goal.outcome}</p>
        </div>
        <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">具体的な範囲</h4>
            <p className="text-sm">{goal.scope}</p>
        </div>
        </div>
    )
}
