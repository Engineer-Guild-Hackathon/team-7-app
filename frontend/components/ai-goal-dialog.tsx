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
import { conversationTalkMemory } from "@/lib/conversation-talk-memory"

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
    const [previewGoal, setPreviewGoal] = useState<Goal | null>(null)

    /* 会話履歴を保存 */
    const [conversation, setConversation] = useState<{ role: "user" | "AI"; content: string }[]>([]);
    /* ユーザとAIそれぞれの発言を会話履歴に送信 */
    const addUserMessage = (content: string) => {
        setConversation(prev => [...prev, { role: "user", content }]);
    };
    const addAiMessage = (content: string) => {
        setConversation(prev => [...prev, { role: "AI", content }]);
    };

    const [goalStatus, setGoalStatus] = useState({
        title: "",
        reason: "",
        outcome: "",
        scope: "",
        deadline: "",
    });

    // --- 通常の会話 ---
    const sendAiMessage = async () => {
        if (!aiInput.trim()) return

        const latestMessage = { role: "user", content: aiInput }
        setAiInput("")

        const messageToSend = [...conversation, latestMessage]

        console.log(messageToSend)
        try {
        const res = await fetch("/api/goal-ai-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messageToSend,
                latestMessage,
                status: goalStatus,
            }),
        })

        const data = await res.json()
        console.log("JSON部分: ", data.status);
        console.log("返信部分: ", data.reply)

        setAiConversation(prev => [
            ...prev,
            { role: "user", message: latestMessage.content },
            { role: "AI", message: data.reply },
        ])
        addAiMessage(data.reply)
        addUserMessage(latestMessage.content)

        setGoalStatus(data.status);
        } catch (error) {
            console.error(error)
        }

    }

    // --- 提案確認で JSON を生成 ---
    const generateAiGoal = async () => {
        console.log("JSON生成前の会話履歴: ", conversation)
        try {
        const res = await fetch("/api/goal-ai-goal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conversation,
            }),
        })

        const data = await res.json()
        console.log(data.goal);
        if (data.type === "goal") {
            setPreviewGoal(data.goal)
        } else {
            console.warn("JSON生成失敗:", data)
        }
        } catch (error) {
        console.error(error)
        }
    }

    return (
        <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogTrigger asChild>
            <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            AIと対話して作成
            </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vw] h-[80vh] max-w-5xl flex flex-col">
            <DialogHeader>
            <DialogTitle>AIと対話して目標を設定</DialogTitle>
            <DialogDescription>AIがあなたの目標設定をサポートします</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col h-full space-y-4">
            {/* --- 対話ログ --- */}
            <div className="flex-1 min-h-0 overflow-y-auto border rounded-lg p-4 space-y-3">
                {aiConversation.length === 0 && (
                <div className="text-center text-muted-foreground">
                    まずはあなたの目標を入力してください
                </div>
                )}
                {aiConversation.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                    style={{ whiteSpace: 'pre-wrap' }}
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

            {/* --- 提案ボタン & プレビュー --- */}
            {aiConversation.length >= 4 && (
                <>
                <Button onClick={generateAiGoal} className="w-full">
                    AIが提案する目標を作成
                </Button>

                {previewGoal && (
                    <div className="border rounded-lg p-6 bg-background h-[40vh] mt-4 shadow overflow-y-auto">
                    <h3 className="font-semibold mb-4 text-lg">AI提案のプレビュー</h3>
                    <div className="space-y-2">
                        <p><strong>タイトル:</strong> {previewGoal.title}</p>
                        <p><strong>理由:</strong> {previewGoal.reason}</p>
                        <p><strong>成果:</strong> {previewGoal.outcome}</p>
                        <p><strong>範囲:</strong> {previewGoal.scope}</p>
                        <p><strong>期限:</strong> {previewGoal.deadline}</p>
                    </div>

                    <Button
                        className="w-full mt-6"
                        onClick={() => {
                        onCreateGoal(previewGoal)
                        setPreviewGoal(null)
                        setIsAiDialogOpen(false)
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
    )
}
