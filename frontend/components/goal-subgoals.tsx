"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, Plus } from "lucide-react"

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

interface GoalSubgoalsProps {
    goal: Goal
    onToggleSubGoal: (goalId: string, subGoalId: string) => void
    onAddSubGoal: (goalId: string, title: string) => void
}

export function GoalSubgoals({ goal, onToggleSubGoal, onAddSubGoal }: GoalSubgoalsProps) {
    const [newSubGoal, setNewSubGoal] = useState("")

    const handleAddSubGoal = () => {
        if (newSubGoal.trim()) {
        onAddSubGoal(goal.id, newSubGoal)
        setNewSubGoal("")
        }
    }

    return (
        <div className="space-y-4">
        <div className="space-y-2">
            {goal.subGoals.map((subGoal) => (
            <div
                key={subGoal.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
                <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleSubGoal(goal.id, subGoal.id)}
                className="p-0 h-auto"
                >
                {subGoal.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                </Button>
                <div className="flex-1">
                <div className={`${subGoal.completed ? "line-through text-muted-foreground" : ""}`}>{subGoal.title}</div>
                {subGoal.dueDate && (
                    <div className="text-xs text-muted-foreground">
                    期限: {new Date(subGoal.dueDate).toLocaleDateString("ja-JP")}
                    </div>
                )}
                </div>
            </div>
            ))}
        </div>

        <div className="flex gap-2">
            <Input
            value={newSubGoal}
            onChange={(e) => setNewSubGoal(e.target.value)}
            placeholder="新しい小目標を追加..."
            onKeyPress={(e) => e.key === "Enter" && handleAddSubGoal()}
            />
            <Button onClick={handleAddSubGoal} size="sm">
            <Plus className="h-4 w-4" />
            </Button>
        </div>
        </div>
    )
}
