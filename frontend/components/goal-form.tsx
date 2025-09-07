"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Target,
  BookOpen,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  Pause,
  Play,
  MoreHorizontal,
  Download,
  Upload,
  AlertTriangle,
  Bot,
  FormInput,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGoals } from "@/hooks/use-goals"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIGoalChat } from "./ai-goal-chat"

interface Goal {
  id: string
  title: string
  description: string
  reason: string
  category: string
  deadline: string
  difficulty: string
  createdAt: string
  status: "active" | "paused" | "completed"
  tasks: Task[]
  progress: number
}

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export function GoalForm() {
  const {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    addTask,
    toggleTask,
    deleteTask,
    exportData,
    importData,
    clearAllData,
  } = useGoals()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reason: "",
    category: "",
    deadline: "",
    difficulty: "",
  })

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [addingTaskToGoal, setAddingTaskToGoal] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.reason) {
      return
    }

    addGoal(formData)

    // フォームをリセット
    setFormData({
      title: "",
      description: "",
      reason: "",
      category: "",
      deadline: "",
      difficulty: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      reason: goal.reason,
      category: goal.category,
      deadline: goal.deadline,
      difficulty: goal.difficulty,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGoal || !formData.title || !formData.reason) return

    updateGoal(editingGoal.id, formData)

    setIsEditDialogOpen(false)
    setEditingGoal(null)
    setFormData({
      title: "",
      description: "",
      reason: "",
      category: "",
      deadline: "",
      difficulty: "",
    })
  }

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId)
  }

  const handleStatusChange = (goalId: string, newStatus: Goal["status"]) => {
    updateGoal(goalId, { status: newStatus })
  }

  const handleAddTask = (goalId: string) => {
    if (!newTaskTitle.trim()) return

    addTask(goalId, newTaskTitle)

    setNewTaskTitle("")
    setAddingTaskToGoal(null)
  }

  const handleToggleTask = (goalId: string, taskId: string) => {
    toggleTask(goalId, taskId)
  }

  const handleDeleteTask = (goalId: string, taskId: string) => {
    deleteTask(goalId, taskId)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportError(null)
    importData(file)
      .then(() => {
        setImportError(null)
      })
      .catch((error) => {
        setImportError(error.message || "インポートに失敗しました")
      })

    // ファイル入力をリセット
    e.target.value = ""
  }

  const getStatusBadge = (status: Goal["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary">進行中</Badge>
      case "paused":
        return <Badge variant="secondary">一時停止</Badge>
      case "completed":
        return <Badge className="bg-accent/10 text-accent-foreground">完了</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">データを読み込み中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>データ管理</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                エクスポート
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  インポート
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("すべてのデータを削除しますか？この操作は取り消せません。")) {
                    clearAllData()
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                全削除
              </Button>
            </div>
          </CardTitle>
          <CardDescription>学習目標データのバックアップと復元ができます</CardDescription>
        </CardHeader>
        {importError && (
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            新しい学習目標を設定
          </CardTitle>
          <CardDescription>AI対話または詳細フォームで目標を設定できます</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai-chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai-chat" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI対話で設定
              </TabsTrigger>
              <TabsTrigger value="manual-form" className="flex items-center gap-2">
                <FormInput className="w-4 h-4" />
                詳細フォーム
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-chat" className="mt-4">
              <AIGoalChat />
            </TabsContent>

            <TabsContent value="manual-form" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">目標タイトル *</Label>
                  <Input
                    id="title"
                    placeholder="例：React.jsをマスターする"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">目標の詳細</Label>
                  <Textarea
                    id="description"
                    placeholder="具体的にどのようなスキルを身につけたいか詳しく説明してください"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">学習する理由 *</Label>
                  <Textarea
                    id="reason"
                    placeholder="なぜこの目標を達成したいのか、その理由やモチベーションを教えてください"
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">カテゴリー</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="学習分野を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programming">プログラミング</SelectItem>
                        <SelectItem value="design">デザイン</SelectItem>
                        <SelectItem value="language">語学</SelectItem>
                        <SelectItem value="business">ビジネス</SelectItem>
                        <SelectItem value="creative">クリエイティブ</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">難易度</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="難易度を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">初級</SelectItem>
                        <SelectItem value="intermediate">中級</SelectItem>
                        <SelectItem value="advanced">上級</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">目標達成期限</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  目標を設定する
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>設定済みの目標</CardTitle>
            <CardDescription>あなたが設定した学習目標の詳細管理</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4 bg-muted/50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{goal.title}</h3>
                        {getStatusBadge(goal.status)}
                      </div>
                      {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {goal.deadline && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(goal.deadline).toLocaleDateString("ja-JP")}
                        </div>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditGoal(goal)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            編集
                          </DropdownMenuItem>
                          {goal.status === "active" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(goal.id, "paused")}>
                              <Pause className="w-4 h-4 mr-2" />
                              一時停止
                            </DropdownMenuItem>
                          )}
                          {goal.status === "paused" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(goal.id, "active")}>
                              <Play className="w-4 h-4 mr-2" />
                              再開
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeleteGoal(goal.id)} className="text-destructive">
                            <Trash2 className="w-3 h-3 mr-2" />
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="bg-accent/10 rounded p-3">
                    <p className="text-sm font-medium text-accent-foreground mb-1">学習する理由：</p>
                    <p className="text-sm text-foreground">{goal.reason}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {goal.category && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">{goal.category}</span>
                    )}
                    {goal.difficulty && (
                      <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                        {goal.difficulty}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(goal.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                    <div className="ml-auto font-medium text-primary">進捗: {goal.progress}%</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">タスク管理</h4>
                      <Button variant="outline" size="sm" onClick={() => setAddingTaskToGoal(goal.id)}>
                        <Plus className="w-3 h-3 mr-1" />
                        タスク追加
                      </Button>
                    </div>

                    {addingTaskToGoal === goal.id && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="新しいタスクを入力"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTask(goal.id)}
                        />
                        <Button size="sm" onClick={() => handleAddTask(goal.id)}>
                          追加
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAddingTaskToGoal(null)
                            setNewTaskTitle("")
                          }}
                        >
                          キャンセル
                        </Button>
                      </div>
                    )}

                    {goal.tasks.length > 0 && (
                      <div className="space-y-2">
                        {goal.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 p-2 rounded bg-background/50">
                            <button onClick={() => handleToggleTask(goal.id, task.id)}>
                              <CheckCircle2
                                className={`w-4 h-4 ${
                                  task.completed ? "text-primary fill-primary" : "text-muted-foreground"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-sm flex-1 ${
                                task.completed ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(goal.id, task.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {goal.tasks.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        まだタスクが設定されていません。「タスク追加」ボタンから始めましょう。
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>目標を編集</DialogTitle>
            <DialogDescription>学習目標の詳細を更新できます</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">目標タイトル *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">目標の詳細</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-reason">学習する理由 *</Label>
              <Textarea
                id="edit-reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>カテゴリー</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="学習分野を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">プログラミング</SelectItem>
                    <SelectItem value="design">デザイン</SelectItem>
                    <SelectItem value="language">語学</SelectItem>
                    <SelectItem value="business">ビジネス</SelectItem>
                    <SelectItem value="creative">クリエイティブ</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>難易度</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="難易度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">初級</SelectItem>
                    <SelectItem value="intermediate">中級</SelectItem>
                    <SelectItem value="advanced">上級</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-deadline">目標達成期限</Label>
              <Input
                id="edit-deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit">更新する</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
