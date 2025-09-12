"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Target } from "lucide-react"
import { GoalCreationDialog } from "./goal-creation-dialog"
import { AiGoalDialog } from "./ai-goal-dialog"
import { GoalCard } from "./goal-card"

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

type GoalSettingProps = {}

export function GoalSetting({}: GoalSettingProps) {
    const [goals, setGoals] = useState<Goal[]>([
        {
        id: "1",
        title: "プログラミングスキルの向上",
        reason: "転職してより良いキャリアを築きたい",
        outcome: "フルスタック開発者として独立できるレベルになる",
        scope: "React、Node.js、データベース設計を習得する",
        deadline: "2024-12-31",
        progress: 35,
        subGoals: [
            { id: "1-1", title: "React基礎を完了", completed: true, dueDate: "2024-02-15" },
            { id: "1-2", title: "Node.js APIを構築", completed: true, dueDate: "2024-03-01" },
            { id: "1-3", title: "データベース設計を学習", completed: false, dueDate: "2024-03-15" },
            { id: "1-4", title: "ポートフォリオサイト作成", completed: false, dueDate: "2024-04-01" },
        ],
        createdAt: "2024-01-01",
        },
    ])

    const handleCreateManualGoal = (goalData: Omit<Goal, "id" | "progress" | "subGoals" | "createdAt">) => {
        const goal: Goal = {
        id: Date.now().toString(),
        ...goalData,
        progress: 0,
        subGoals: [],
        createdAt: new Date().toISOString(),
        }
        setGoals([...goals, goal])
    }

    const handleCreateAiGoal = (goal: Goal) => {
        setGoals([...goals, goal])
    }

    const addSubGoal = (goalId: string, title: string) => {
        setGoals(
        goals.map((goal) =>
            goal.id === goalId
            ? {
                ...goal,
                subGoals: [
                    ...goal.subGoals,
                    {
                    id: `${goalId}-${Date.now()}`,
                    title,
                    completed: false,
                    dueDate: "",
                    },
                ],
                }
            : goal,
        ),
        )
    }

    const toggleSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(
        goals.map((goal) => {
            if (goal.id !== goalId) return goal;

            // "final" の場合は最終目標の完了をトグル
            if (subGoalId === "final") {
                const isCompleted = goal.progress === 100;
                const totalSubGoals = goal.subGoals.length;
                const completedSubGoals = goal.subGoals.filter(sub => sub.completed).length;
                const newProgress = isCompleted
                    ? Math.round((completedSubGoals / (totalSubGoals + 1)) * 100)
                    : 100;

                return {
                    ...goal,
                    progress: newProgress
                };
            }

            // 通常のサブゴールトグル
            const newSubGoals = goal.subGoals.map((sub) =>
                sub.id === subGoalId ? { ...sub, completed: !sub.completed } : sub
            );

            const completedSubGoals = newSubGoals.filter(sub => sub.completed).length;
            const totalSteps = newSubGoals.length + 1; // 最終目標を含める
            const achievedSteps = completedSubGoals + (goal.progress === 100 ? 1 : 0);
            const newProgress = Math.round((achievedSteps / totalSteps) * 100);

            return {
                ...goal,
                subGoals: newSubGoals,
                progress: newProgress
            };
        })
    );
};


    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-3xl font-bold text-foreground">目標設定</h2>
            <p className="text-muted-foreground">あなたの学習目標を設定し、進捗を可視化しましょう</p>
            </div>
            <div className="flex gap-2">
            <GoalCreationDialog onCreateGoal={handleCreateManualGoal} />
            <AiGoalDialog onCreateGoal={handleCreateAiGoal} />
            </div>
        </div>

        {/* Goals List */}
        <div className="grid gap-6">
            {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onToggleSubGoal={toggleSubGoal} onAddSubGoal={addSubGoal} />
            ))}

            {goals.length === 0 && (
            <Card className="text-center py-12">
                <CardContent>
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">目標を設定しましょう</h3>
                <p className="text-muted-foreground mb-4">学習目標を設定して、効率的に成長を追跡しましょう</p>
                <div className="flex gap-2 justify-center">
                    <GoalCreationDialog onCreateGoal={handleCreateManualGoal} />
                    <AiGoalDialog onCreateGoal={handleCreateAiGoal} />
                </div>
                </CardContent>
            </Card>
            )}
        </div>
        </div>
    )
}
