"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Calendar, TrendingUp } from "lucide-react"
import { GoalOverview } from "./goal-overview"
import { GoalProgress } from "./goal-progress"
import { GoalSubgoals } from "./goal-subgoals"
import { GoalRoadmap } from "./goal-roadmap"

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

interface GoalCardProps {
    goal: Goal
    onToggleSubGoal: (goalId: string, subGoalId: string) => void
    onAddSubGoal: (goalId: string, title: string) => void
}

export function GoalCard({ goal, onToggleSubGoal, onAddSubGoal }: GoalCardProps) {
    return (
        <Card className="overflow-hidden">
        <CardHeader>
            <div className="flex items-start justify-between">
            <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {goal.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    期限: {new Date(goal.deadline).toLocaleDateString("ja-JP")}
                </div>
                <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    進捗: {goal.progress}%
                </div>
                </div>
            </div>
            <Badge variant={goal.progress === 100 ? "default" : "secondary"}>
                {goal.progress === 100 ? "完了" : "進行中"}
            </Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="progress">進捗</TabsTrigger>
                <TabsTrigger value="subgoals">小目標</TabsTrigger>
                <TabsTrigger value="roadmap">道のり</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <GoalOverview goal={goal} />
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
                <GoalProgress goal={goal} />
            </TabsContent>

            <TabsContent value="subgoals" className="space-y-4">
                <GoalSubgoals goal={goal} onToggleSubGoal={onToggleSubGoal} onAddSubGoal={onAddSubGoal} />
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-4">
                <GoalRoadmap goal={goal} onToggleSubGoal={onToggleSubGoal} />
            </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
    )
}
