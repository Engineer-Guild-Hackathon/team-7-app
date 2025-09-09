"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle } from "lucide-react"

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

interface AiGoalDialogProps {
    onCreateGoal: (goal: Goal) => void
}

export function AiGoalDialog({ onCreateGoal }: AiGoalDialogProps) {
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
    const [aiConversation, setAiConversation] = useState<{ role: string; message: string }[]>([])
    const [aiInput, setAiInput] = useState("")

    const sendAiMessage = () => {
        if (aiInput.trim()) {
        const newConversation = [...aiConversation, { role: "user", message: aiInput }]

        // Simulate AI response
        setTimeout(() => {
            let aiResponse = ""
            if (newConversation.length === 1) {
            aiResponse =
                "こんにちは！目標設定のお手伝いをさせていただきます。まず、どのような分野で成長したいか教えてください。例：プログラミング、語学、資格取得、健康管理など"
            } else if (aiInput.includes("プログラミング")) {
            aiResponse =
                "プログラミングスキルの向上ですね！具体的にはどの言語や技術に興味がありますか？また、なぜプログラミングを学びたいのか理由を教えてください。"
            } else {
            aiResponse =
                "なるほど、それは素晴らしい目標ですね。その目標を達成したい理由と、達成後にどうなりたいかを詳しく教えてください。"
            }

            setAiConversation([...newConversation, { role: "ai", message: aiResponse }])
        }, 1000)

        setAiInput("")
        }
    }

    const generateAiGoal = () => {
        // Simulate AI goal generation based on conversation
        const aiGoal: Goal = {
        id: Date.now().toString(),
        title: "AI提案：Web開発スキルマスター",
        reason: "フリーランスとして独立し、場所に縛られない働き方を実現したい",
        outcome: "月収50万円以上のフリーランス開発者になる",
        scope: "フロントエンド・バックエンド・デプロイまでの全工程を習得",
        deadline: "2024-12-31",
        progress: 0,
        subGoals: [
            { id: "ai-1", title: "HTML/CSS/JavaScript基礎", completed: false, dueDate: "2024-02-29" },
            { id: "ai-2", title: "React.js習得", completed: false, dueDate: "2024-04-30" },
            { id: "ai-3", title: "Node.js/Express習得", completed: false, dueDate: "2024-06-30" },
            { id: "ai-4", title: "データベース設計", completed: false, dueDate: "2024-08-31" },
            { id: "ai-5", title: "ポートフォリオ作成", completed: false, dueDate: "2024-10-31" },
        ],
        createdAt: new Date().toISOString(),
        }

        onCreateGoal(aiGoal)
        setIsAiDialogOpen(false)
        setAiConversation([])
    }

    return (
        <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogTrigger asChild>
            <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            AIと対話して作成
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
            <DialogTitle>AIと対話して目標を設定</DialogTitle>
            <DialogDescription>AIがあなたの目標設定をサポートします</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
            <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                {aiConversation.length === 0 && (
                <div className="text-center text-muted-foreground">AIとの対話を開始してください</div>
                )}
                {aiConversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                    >
                    {msg.message}
                    </div>
                </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="メッセージを入力..."
                onKeyPress={(e) => e.key === "Enter" && sendAiMessage()}
                />
                <Button onClick={sendAiMessage}>送信</Button>
            </div>
            {aiConversation.length >= 4 && (
                <Button onClick={generateAiGoal} className="w-full">
                AIが提案する目標を作成
                </Button>
            )}
            </div>
        </DialogContent>
        </Dialog>
    )
}
