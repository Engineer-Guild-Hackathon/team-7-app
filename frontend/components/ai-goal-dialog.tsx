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

    const sendAiMessage = async () => {
        if (aiInput.trim()) {
            const newConversation = [
            ...aiConversation,
            { role: "user", message: aiInput },
            ];
            setAiConversation(newConversation);
            setAiInput("");

            try {
            const res = await fetch("/api/ai-goals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                messages: [
                    { role: "system", content: "あなたは目標設定をサポートするアシスタントです。" },
                    ...newConversation.map((c) => ({
                    role: c.role === "user" ? "user" : "assistant",
                    content: c.message,
                    })),
                ],
                }),
            });

            const data = await res.json();

            if (data.type === "message") {
                setAiConversation([
                ...newConversation,
                { role: "assistant", message: data.text },
                ]);
            } else if (data.type === "goal") {
                setPreviewGoal(data.goal); // 🔽 ここでプレビューに反映
            }
            } catch (error) {
            console.error(error);
            }
        }
    };



    const [previewGoal, setPreviewGoal] = useState<Goal | null>(null)

    const generateAiGoal = async () => {
        try {
            const res = await fetch("/api/ai-goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: aiConversation.map((c) => ({
                role: c.role === "user" ? "user" : "assistant",
                content: c.message,
                })),
            }),
            })

            const data = await res.json()
            if (data.goal) {
            setPreviewGoal(data.goal) // ← プレビューにセット
            }
        } catch (error) {
            console.error(error)
        }
    }



    {return (
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
                {/* --- 対話ログ --- */}
                <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                {aiConversation.length === 0 && (
                    <div className="text-center text-muted-foreground">
                    AIとの対話を開始してください
                    </div>
                )}
                {aiConversation.map((msg, index) => (
                    <div
                    key={index}
                    className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    >
                    <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                    >
                        {msg.message}
                    </div>
                    </div>
                ))}
                </div>

                {/* --- 入力欄 --- */}
                <div className="flex gap-2">
                <Input
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="メッセージを入力..."
                    onKeyPress={(e) => e.key === "Enter" && sendAiMessage()}
                />
                <Button onClick={sendAiMessage}>送信</Button>
                </div>

                {/* --- 提案ボタン --- */}
                {aiConversation.length >= 4 && (
                <>
                    <Button onClick={generateAiGoal} className="w-full">
                    AIが提案する目標を作成
                    </Button>

                    {/* 🔽 プレビュー表示 */}
                    {previewGoal && (
                    <div className="border rounded-lg p-4 bg-muted">
                        <h3 className="font-semibold mb-2">AI提案のプレビュー</h3>
                        <p><strong>タイトル:</strong> {previewGoal.title}</p>
                        <p><strong>理由:</strong> {previewGoal.reason}</p>
                        <p><strong>成果:</strong> {previewGoal.outcome}</p>
                        <p><strong>範囲:</strong> {previewGoal.scope}</p>
                        <p><strong>期限:</strong> {previewGoal.deadline}</p>

                        {/* ✅ 確定ボタン */}
                        <Button
                        className="w-full"
                        onClick={() => {
                            onCreateGoal(previewGoal)
                            setPreviewGoal(null)         // プレビューをクリア
                            setIsAiDialogOpen(false)     // ダイアログを閉じる
                        }}
                        >
                        この目標で登録
                        </Button>
                    </div>
                    )}
                </>
                )}
            </div>
            </DialogContent>
        </Dialog>
    )}
}