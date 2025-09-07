"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Target, CheckCircle2, Circle } from "lucide-react"
import { useGoals } from "@/hooks/use-goals"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface SuggestedGoal {
  title: string
  description: string
  reason: string
  category: string
  difficulty: string
  subGoals: string[]
}

export function AIGoalChat() {
  const { addGoal } = useGoals()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "こんにちは！学習目標の設定をお手伝いします。どのようなスキルを身につけたいですか？具体的な目標や理由を教えてください。",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedGoal, setSuggestedGoal] = useState<SuggestedGoal | null>(null)
  const [completedSubGoals, setCompletedSubGoals] = useState<Set<number>>(new Set())
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const addMessage = (type: "user" | "ai", content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateAIResponse = (userInput: string) => {
    setIsTyping(true)

    setTimeout(() => {
      // シンプルなキーワードベースの応答システム
      let response = ""
      let goal: SuggestedGoal | null = null

      const input = userInput.toLowerCase()

      if (input.includes("react") || input.includes("javascript") || input.includes("フロントエンド")) {
        response = "React.jsの学習ですね！素晴らしい選択です。以下のような学習プランを提案します："
        goal = {
          title: "React.jsマスター",
          description: "モダンなReact.jsを使ったフロントエンド開発スキルの習得",
          reason: userInput,
          category: "programming",
          difficulty: "intermediate",
          subGoals: [
            "JavaScript基礎の復習",
            "React基本概念の理解（コンポーネント、JSX）",
            "Hooksの習得（useState, useEffect）",
            "状態管理の学習（Context API）",
            "実践プロジェクトの作成",
          ],
        }
      } else if (input.includes("python") || input.includes("機械学習") || input.includes("ai")) {
        response = "Python・AI分野の学習ですね！将来性の高い分野です。以下のステップで進めましょう："
        goal = {
          title: "Python・AI開発スキル習得",
          description: "PythonとAI・機械学習の基礎から実践まで",
          reason: userInput,
          category: "programming",
          difficulty: "advanced",
          subGoals: [
            "Python基礎文法の習得",
            "NumPy・Pandasの学習",
            "機械学習ライブラリ（scikit-learn）",
            "深層学習の基礎（TensorFlow/PyTorch）",
            "実際のデータセットでの実践",
          ],
        }
      } else if (input.includes("英語") || input.includes("toeic") || input.includes("語学")) {
        response = "英語学習ですね！グローバルに活躍するために重要なスキルです。段階的に進めましょう："
        goal = {
          title: "英語コミュニケーション能力向上",
          description: "実践的な英語スキルの習得とTOEICスコア向上",
          reason: userInput,
          category: "language",
          difficulty: "intermediate",
          subGoals: [
            "基礎文法の復習",
            "語彙力強化（毎日50単語）",
            "リスニング練習（毎日30分）",
            "スピーキング練習",
            "TOEIC模試と実践",
          ],
        }
      } else if (input.includes("デザイン") || input.includes("ui") || input.includes("ux")) {
        response = "UI/UXデザインの学習ですね！ユーザー体験を向上させる重要なスキルです："
        goal = {
          title: "UI/UXデザインスキル習得",
          description: "ユーザー中心のデザイン思考と実践的なデザインスキル",
          reason: userInput,
          category: "design",
          difficulty: "intermediate",
          subGoals: [
            "デザイン基礎理論の学習",
            "Figma/Adobe XDの操作習得",
            "ユーザーリサーチ手法の理解",
            "プロトタイピングの実践",
            "ポートフォリオ作成",
          ],
        }
      } else {
        response =
          "興味深い目標ですね！もう少し詳しく教えてください。具体的にどのようなスキルを身につけたいか、なぜそれを学びたいのか、どのレベルまで到達したいかなどを教えていただけますか？"
      }

      setIsTyping(false)
      addMessage("ai", response)

      if (goal) {
        setSuggestedGoal(goal)
        setCompletedSubGoals(new Set())
      }
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage("user", inputValue)
    simulateAIResponse(inputValue)
    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleSubGoal = (index: number) => {
    const newCompleted = new Set(completedSubGoals)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedSubGoals(newCompleted)
  }

  const handleAcceptGoal = () => {
    if (!suggestedGoal) return

    const tasks = suggestedGoal.subGoals.map((subGoal, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: subGoal,
      completed: completedSubGoals.has(index),
      createdAt: new Date().toISOString(),
    }))

    addGoal(
      {
        title: suggestedGoal.title,
        description: suggestedGoal.description,
        reason: suggestedGoal.reason,
        category: suggestedGoal.category,
        difficulty: suggestedGoal.difficulty,
        deadline: "",
      },
      tasks,
    )

    setSuggestedGoal(null)
    setCompletedSubGoals(new Set())
    addMessage(
      "ai",
      "目標が正常に設定されました！頑張って学習を進めてくださいね。他にも目標があれば、いつでもお聞かせください。",
    )
  }

  const calculateProgress = () => {
    if (!suggestedGoal) return 0
    return Math.round((completedSubGoals.size / suggestedGoal.subGoals.length) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI学習コーチ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-96 w-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {suggestedGoal && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  提案された学習プラン
                </CardTitle>
                <Badge variant="outline" className="text-primary border-primary">
                  進捗: {calculateProgress()}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">{suggestedGoal.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{suggestedGoal.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">学習ステップ（達成済みをチェック）:</h4>
                <div className="space-y-2">
                  {suggestedGoal.subGoals.map((subGoal, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded bg-background/50">
                      <button onClick={() => toggleSubGoal(index)}>
                        {completedSubGoals.has(index) ? (
                          <CheckCircle2 className="w-4 h-4 text-primary fill-primary" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <span
                        className={`text-sm flex-1 ${
                          completedSubGoals.has(index) ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {index + 1}. {subGoal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleAcceptGoal} className="flex-1">
                  この目標を設定する
                </Button>
                <Button variant="outline" onClick={() => setSuggestedGoal(null)}>
                  キャンセル
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="学習したいことを教えてください..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
