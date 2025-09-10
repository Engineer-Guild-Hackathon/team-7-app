"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Target, Clock } from "lucide-react"

interface DashboardOverviewProps {
    totalStudyTime: number
    totalNonStudyTime: number
    studyPercentage: number
    studyGoal: number
    setStudyGoal: (goal: number) => void
}

export function DashboardOverview({
    totalStudyTime,
    totalNonStudyTime,
    studyPercentage,
    studyGoal,
    setStudyGoal,
}: DashboardOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日の勉強時間</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-primary">
                {Math.floor(totalStudyTime / 60)}時間{totalStudyTime % 60}分
            </div>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">目標:</span>
                <Input
                type="number"
                value={studyGoal}
                onChange={(e) => setStudyGoal(Number(e.target.value))}
                className="w-16 h-6 text-xs"
                min="1"
                max="24"
                />
                <span className="text-xs text-muted-foreground">時間</span>
            </div>
            <Progress value={(totalStudyTime / (studyGoal * 60)) * 100} className="mt-2" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">勉強効率</CardTitle>
            <Target className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-secondary">{studyPercentage}%</div>
            <p className="text-xs text-muted-foreground">勉強時間の割合</p>
            <Progress value={studyPercentage} className="mt-2" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総使用時間</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {Math.floor((totalStudyTime + totalNonStudyTime) / 60)}時間
                {(totalStudyTime + totalNonStudyTime) % 60}分
            </div>
            <p className="text-xs text-muted-foreground">PC使用時間</p>
            </CardContent>
        </Card>
        </div>
    )
}
