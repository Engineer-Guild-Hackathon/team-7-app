"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

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

interface GoalCreationDialogProps {
    onCreateGoal: (goal: Omit<Goal, "id" | "progress" | "subGoals" | "createdAt">) => void
}

export function GoalCreationDialog({ onCreateGoal }: GoalCreationDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newGoal, setNewGoal] = useState({
        title: "",
        reason: "",
        outcome: "",
        scope: "",
        deadline: "",
    })

    const createManualGoal = () => {
        if (newGoal.title.trim()) {
        onCreateGoal(newGoal)
        setNewGoal({ title: "", reason: "", outcome: "", scope: "", deadline: "" })
        setIsDialogOpen(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
            <Button>
            <Plus className="h-4 w-4 mr-2" />
            手動で作成
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle>新しい目標を作成</DialogTitle>
            <DialogDescription>あなたの学習目標を詳しく設定してください</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
            <div>
                <Label htmlFor="title">目標のタイトル</Label>
                <Input
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="例：プログラミングスキルの向上"
                />
            </div>
            <div>
                <Label htmlFor="reason">達成したい理由</Label>
                <Textarea
                id="reason"
                value={newGoal.reason}
                onChange={(e) => setNewGoal({ ...newGoal, reason: e.target.value })}
                placeholder="なぜこの目標を達成したいのですか？"
                />
            </div>
            <div>
                <Label htmlFor="outcome">達成して何をしたいか</Label>
                <Textarea
                id="outcome"
                value={newGoal.outcome}
                onChange={(e) => setNewGoal({ ...newGoal, outcome: e.target.value })}
                placeholder="目標達成後にどうなりたいですか？"
                />
            </div>
            <div>
                <Label htmlFor="scope">どこまでやりたいか（具体的な範囲）</Label>
                <Textarea
                id="scope"
                value={newGoal.scope}
                onChange={(e) => setNewGoal({ ...newGoal, scope: e.target.value })}
                placeholder="具体的にどのレベルまで達成したいですか？"
                />
            </div>
            <div>
                <Label htmlFor="deadline">目標期限</Label>
                <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
            </div>
            <Button onClick={createManualGoal} className="w-full">
                目標を作成
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    )
}
