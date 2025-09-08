"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Plus, MessageCircle, CheckCircle2, Circle, Calendar, TrendingUp } from "lucide-react"
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

    const [isManualMode, setIsManualMode] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
    const [aiConversation, setAiConversation] = useState<{ role: string; message: string }[]>([])
    const [aiInput, setAiInput] = useState("")

    // Manual goal creation form
    const [newGoal, setNewGoal] = useState({
        title: "",
        reason: "",
        outcome: "",
        scope: "",
        deadline: "",
    })

    const [newSubGoal, setNewSubGoal] = useState("")
    const [selectedGoalId, setSelectedGoalId] = useState("")

    const createManualGoal = () => {
        if (newGoal.title.trim()) {
        const goal: Goal = {
            id: Date.now().toString(),
            ...newGoal,
            progress: 0,
            subGoals: [],
            createdAt: new Date().toISOString(),
        }
        setGoals([...goals, goal])
        setNewGoal({ title: "", reason: "", outcome: "", scope: "", deadline: "" })
        setIsDialogOpen(false)
        }
    }

    const addSubGoal = (goalId: string) => {
        if (newSubGoal.trim()) {
        setGoals(
            goals.map((goal) =>
            goal.id === goalId
                ? {
                    ...goal,
                    subGoals: [
                    ...goal.subGoals,
                    {
                        id: `${goalId}-${Date.now()}`,
                        title: newSubGoal,
                        completed: false,
                        dueDate: "",
                    },
                    ],
                }
                : goal,
            ),
        )
        setNewSubGoal("")
        }
    }

    const toggleSubGoal = (goalId: string, subGoalId: string) => {
        setGoals(
        goals.map((goal) =>
            goal.id === goalId
            ? {
                ...goal,
                subGoals: goal.subGoals.map((sub) =>
                    sub.id === subGoalId ? { ...sub, completed: !sub.completed } : sub,
                ),
                progress: Math.round(
                    ((goal.subGoals.filter((sub) => (sub.id === subGoalId ? !sub.completed : sub.completed)).length +
                    (goal.subGoals.find((sub) => sub.id === subGoalId)?.completed ? 0 : 1)) /
                    goal.subGoals.length) *
                    100,
                ),
                }
            : goal,
        ),
        )
    }

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

        setGoals([...goals, aiGoal])
        setIsAiDialogOpen(false)
        setAiConversation([])
    }


    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-3xl font-bold text-foreground">目標設定</h2>
            <p className="text-muted-foreground">あなたの学習目標を設定し、進捗を可視化しましょう</p>
            </div>
            <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                <Button onClick={() => setIsManualMode(true)}>
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

            <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setIsManualMode(false)}>
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
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
            </div>
        </div>

        {/* Goals List */}
        <div className="grid gap-6">
            {goals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
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
                {/* Goal Details */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">概要</TabsTrigger>
                    <TabsTrigger value="progress">進捗</TabsTrigger>
                    <TabsTrigger value="subgoals">小目標</TabsTrigger>
                    <TabsTrigger value="roadmap">道のり</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
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
                    </TabsContent>

                    <TabsContent value="progress" className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">全体の進捗</span>
                        <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                            {goal.subGoals.filter((sub) => sub.completed).length}
                        </div>
                        <div className="text-sm text-muted-foreground">完了済み</div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">
                            {goal.subGoals.filter((sub) => !sub.completed).length}
                        </div>
                        <div className="text-sm text-muted-foreground">残り</div>
                        </div>
                    </div>
                    </TabsContent>

                    <TabsContent value="subgoals" className="space-y-4">
                    <div className="space-y-2">
                        {goal.subGoals.map((subGoal) => (
                        <div
                            key={subGoal.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSubGoal(goal.id, subGoal.id)}
                            className="p-0 h-auto"
                            >
                            {subGoal.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            </Button>
                            <div className="flex-1">
                            <div className={`${subGoal.completed ? "line-through text-muted-foreground" : ""}`}>
                                {subGoal.title}
                            </div>
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
                        onKeyPress={(e) => e.key === "Enter" && addSubGoal(goal.id)}
                        />
                        <Button onClick={() => addSubGoal(goal.id)} size="sm">
                        <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    </TabsContent>

                    <TabsContent value="roadmap" className="space-y-4">
                    <GoalRoadmap goal={goal} />
                    </TabsContent>
                </Tabs>
                </CardContent>
            </Card>
            ))}

            {goals.length === 0 && (
            <Card className="text-center py-12">
                <CardContent>
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">目標を設定しましょう</h3>
                <p className="text-muted-foreground mb-4">学習目標を設定して、効率的に成長を追跡しましょう</p>
                <div className="flex gap-2 justify-center">
                    <Button onClick={() => setIsDialogOpen(true)}>手動で作成</Button>
                    <Button variant="outline" onClick={() => setIsAiDialogOpen(true)}>
                    AIと対話して作成
                    </Button>
                </div>
                </CardContent>
            </Card>
            )}
        </div>
        </div>
    )
}
