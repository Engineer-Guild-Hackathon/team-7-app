"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Clock,
  BookOpen,
  Monitor,
  Plus,
  Settings,
  Calendar,
  Target,
  Trash2,
  Brain,
  Bell,
  Shield,
  Palette,
  Database,
} from "lucide-react"

// Mock data - これは実際のバックエンドから取得されるデータです
const mockDailyData = [
  { name: "月", study: 4.5, nonStudy: 3.5 },
  { name: "火", study: 6.2, nonStudy: 2.8 },
  { name: "水", study: 3.8, nonStudy: 4.2 },
  { name: "木", study: 5.5, nonStudy: 2.5 },
  { name: "金", study: 4.0, nonStudy: 4.0 },
  { name: "土", study: 7.2, nonStudy: 1.8 },
  { name: "日", study: 5.8, nonStudy: 3.2 },
]

const mockWeeklyData = [
  { week: "第1週", study: 32, nonStudy: 18 },
  { week: "第2週", study: 28, nonStudy: 22 },
  { week: "第3週", study: 35, nonStudy: 15 },
  { week: "第4週", study: 38, nonStudy: 12 },
]

const initialAppUsage = [
  { id: 1, name: "Visual Studio Code", time: 180, type: "study" },
  { id: 2, name: "Chrome (学習サイト)", time: 120, type: "study" },
  { id: 3, name: "Notion", time: 90, type: "study" },
  { id: 4, name: "YouTube", time: 85, type: "break" },
  { id: 5, name: "Discord", time: 45, type: "break" },
  { id: 6, name: "Twitter", time: 30, type: "other" },
]

export default function ScreenTimeApp() {
  const [categories, setCategories] = useState([
    { id: "study", name: "勉強", color: "hsl(var(--chart-1))" },
    { id: "break", name: "息抜き", color: "hsl(var(--chart-2))" },
    { id: "other", name: "その他", color: "hsl(var(--chart-3))" },
  ])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [studyGoal, setStudyGoal] = useState(8) // hours
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState("")

  const [categoryApps, setCategoryApps] = useState<Record<string, string[]>>({
    study: ["Visual Studio Code", "Chrome (学習サイト)", "Notion"],
    break: ["YouTube", "Discord"],
  })
  const [newApp, setNewApp] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("study")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [appUsage, setAppUsage] = useState(initialAppUsage)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    autoBreakReminder: true,
    breakInterval: 60, // minutes
    dailyGoalReminder: true,
    weeklyReport: true,
    dataRetention: 30, // days
    theme: "system", // light, dark, system
    language: "ja",
    exportFormat: "json",
  })

  const updateAppCategory = (appId: number, newType: string) => {
    setAppUsage((prev) => prev.map((app) => (app.id === appId ? { ...app, type: newType } : app)))
  }

  const getCategoryLabel = (type: string) => {
    const category = categories.find((cat) => cat.id === type)
    return category ? category.name : "その他"
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "study":
        return "default"
      case "break":
        return "secondary"
      case "other":
        return "outline"
      default:
        return "outline"
    }
  }

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newId = newCategoryName.toLowerCase().replace(/\s+/g, "_")
      const newCategory = {
        id: newId,
        name: newCategoryName.trim(),
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      }
      setCategories([...categories, newCategory])
      setCategoryApps((prev) => ({ ...prev, [newId]: [] }))
      setNewCategoryName("")
      setIsCategoryDialogOpen(false)
    }
  }

  const removeCategory = (categoryId: string) => {
    if (["study", "break", "other"].includes(categoryId)) return // Prevent removing default categories
    setCategories(categories.filter((cat) => cat.id !== categoryId))
    setCategoryApps((prev) => {
      const newApps = { ...prev }
      delete newApps[categoryId]
      return newApps
    })
    // Reset apps using this category to "other"
    setAppUsage((prev) => prev.map((app) => (app.type === categoryId ? { ...app, type: "other" } : app)))
  }

  const analyzeWithAI = async () => {
    setAiAnalysisLoading(true)
    // Simulate API call
    setTimeout(() => {
      const studyTime = Math.floor(totalStudyTime / 60)
      const efficiency = studyPercentage

      let analysis = ""
      if (efficiency >= 80) {
        analysis = `素晴らしい集中力です！今日は${studyTime}時間の勉強を達成し、効率は${efficiency}%でした。特にVisual Studio Codeでの作業時間が長く、プログラミング学習に集中できています。この調子で継続すれば、目標達成は確実です。`
      } else if (efficiency >= 60) {
        analysis = `良いペースで学習が進んでいます。勉強時間は${studyTime}時間、効率は${efficiency}%でした。YouTubeの視聴時間がやや多めなので、休憩時間を意識的に管理することで、さらに効率を上げられそうです。`
      } else {
        analysis = `今日の学習効率は${efficiency}%でした。集中時間を増やすために、SNSやエンターテイメント系アプリの使用時間を制限することをお勧めします。ポモドーロテクニックなどの時間管理手法を試してみてください。`
      }

      setAiAnalysisResult(analysis)
      setAiAnalysisLoading(false)
    }, 2000)
  }

  const addAppToCategory = () => {
    if (newApp.trim() && selectedCategory !== "other") {
      setCategoryApps((prev) => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), newApp.trim()],
      }))
      setNewApp("")
      setIsDialogOpen(false)
    }
  }

  const removeAppFromCategory = (categoryId: string, appName: string) => {
    setCategoryApps((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId]?.filter((app) => app !== appName) || [],
    }))
  }

  const getAppCategory = (appName: string) => {
    for (const [categoryId, apps] of Object.entries(categoryApps)) {
      if (apps.includes(appName)) {
        return categoryId
      }
    }
    return "other" // 登録されていないものは「その他」
  }

  const totalStudyTime = appUsage.filter((app) => app.type === "study").reduce((sum, app) => sum + app.time, 0)
  const totalNonStudyTime = appUsage.filter((app) => app.type !== "study").reduce((sum, app) => sum + app.time, 0)
  const studyPercentage = Math.round((totalStudyTime / (totalStudyTime + totalNonStudyTime)) * 100)

  const pieData = categories
    .map((category) => {
      const categoryTime = appUsage.filter((app) => app.type === category.id).reduce((sum, app) => sum + app.time, 0)
      return {
        name: category.name,
        value: categoryTime,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const exportData = () => {
    const data = {
      appUsage,
      categories,
      categoryApps,
      settings,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `screen-time-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetAllData = () => {
    if (confirm("すべてのデータを削除しますか？この操作は元に戻せません。")) {
      setAppUsage(initialAppUsage)
      setCategories([
        { id: "study", name: "勉強", color: "hsl(var(--chart-1))" },
        { id: "break", name: "息抜き", color: "hsl(var(--chart-2))" },
        { id: "other", name: "その他", color: "hsl(var(--chart-3))" },
      ])
      setCategoryApps({
        study: ["Visual Studio Code", "Chrome (学習サイト)", "Notion"],
        break: ["YouTube", "Discord"],
      })
      setAiAnalysisResult("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Monitor className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">StudyTime Tracker</h1>
                <p className="text-sm text-muted-foreground">あなたの学習時間を効率的に管理</p>
              </div>
            </div>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  設定
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    アプリケーション設定
                  </DialogTitle>
                  <DialogDescription>StudyTime Trackerの動作をカスタマイズできます</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* 通知設定 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Bell className="h-4 w-4" />
                        通知設定
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notifications">通知を有効にする</Label>
                          <p className="text-sm text-muted-foreground">アプリからの通知を受け取ります</p>
                        </div>
                        <Switch
                          id="notifications"
                          checked={settings.notifications}
                          onCheckedChange={(checked) => updateSetting("notifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="break-reminder">休憩リマインダー</Label>
                          <p className="text-sm text-muted-foreground">定期的に休憩を促します</p>
                        </div>
                        <Switch
                          id="break-reminder"
                          checked={settings.autoBreakReminder}
                          onCheckedChange={(checked) => updateSetting("autoBreakReminder", checked)}
                        />
                      </div>

                      {settings.autoBreakReminder && (
                        <div className="ml-4 space-y-2">
                          <Label htmlFor="break-interval">休憩間隔（分）</Label>
                          <Input
                            id="break-interval"
                            type="number"
                            value={settings.breakInterval}
                            onChange={(e) => updateSetting("breakInterval", Number(e.target.value))}
                            min="15"
                            max="180"
                            className="w-24"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="goal-reminder">目標達成リマインダー</Label>
                          <p className="text-sm text-muted-foreground">日次目標の進捗を通知します</p>
                        </div>
                        <Switch
                          id="goal-reminder"
                          checked={settings.dailyGoalReminder}
                          onCheckedChange={(checked) => updateSetting("dailyGoalReminder", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weekly-report">週次レポート</Label>
                          <p className="text-sm text-muted-foreground">毎週の学習レポートを送信します</p>
                        </div>
                        <Switch
                          id="weekly-report"
                          checked={settings.weeklyReport}
                          onCheckedChange={(checked) => updateSetting("weeklyReport", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 外観設定 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Palette className="h-4 w-4" />
                        外観設定
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">テーマ</Label>
                        <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">ライト</SelectItem>
                            <SelectItem value="dark">ダーク</SelectItem>
                            <SelectItem value="system">システム設定に従う</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">言語</Label>
                        <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ja">日本語</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* データ管理 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="h-4 w-4" />
                        データ管理
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="data-retention">データ保持期間（日）</Label>
                        <Input
                          id="data-retention"
                          type="number"
                          value={settings.dataRetention}
                          onChange={(e) => updateSetting("dataRetention", Number(e.target.value))}
                          min="7"
                          max="365"
                          className="w-24"
                        />
                        <p className="text-sm text-muted-foreground">
                          指定した日数を過ぎたデータは自動的に削除されます
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="export-format">エクスポート形式</Label>
                        <Select
                          value={settings.exportFormat}
                          onValueChange={(value) => updateSetting("exportFormat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="xlsx">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={exportData} variant="outline">
                          データをエクスポート
                        </Button>
                        <Button onClick={resetAllData} variant="destructive">
                          すべてのデータを削除
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* プライバシー設定 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-4 w-4" />
                        プライバシー設定
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">データの取り扱いについて</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• すべてのデータはローカルに保存されます</li>
                          <li>• 外部サーバーへの送信は行いません</li>
                          <li>• アプリの使用状況は匿名化されて分析されます</li>
                          <li>• データの削除はいつでも可能です</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={() => setIsSettingsOpen(false)}>設定を保存</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">ダッシュボード</TabsTrigger>
            <TabsTrigger value="apps">アプリ管理</TabsTrigger>
            <TabsTrigger value="daily">日次レポート</TabsTrigger>
            <TabsTrigger value="weekly">週次レポート</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Today's Summary */}
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>今日の時間配分</CardTitle>
                  <CardDescription>カテゴリ別の時間配分</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${Math.floor(Number(value) / 60)}時間${Number(value) % 60}分`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>アプリ別使用時間</CardTitle>
                  <CardDescription>今日の主要アプリ使用状況（カテゴリ変更可能）</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appUsage.map((app) => (
                      <div key={app.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Badge variant={getBadgeVariant(app.type)}>{getCategoryLabel(app.type)}</Badge>
                          <span className="text-sm font-medium flex-1">{app.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground min-w-[80px] text-right">
                            {Math.floor(app.time / 60)}時間{app.time % 60}分
                          </span>
                          <Select value={app.type} onValueChange={(value) => updateAppCategory(app.id, value)}>
                            <SelectTrigger className="w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AIからのフィードバック
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={analyzeWithAI} disabled={aiAnalysisLoading} className="w-full">
                    {aiAnalysisLoading ? "分析中..." : "今日の活動データを分析して"}
                  </Button>

                  {aiAnalysisResult && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm text-foreground leading-relaxed">{aiAnalysisResult}</p>
                    </div>
                  )}

                  {!aiAnalysisResult && !aiAnalysisLoading && (
                    <div className="space-y-3">
                      {studyPercentage >= 70 ? (
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-primary font-medium">素晴らしい集中力です！</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            今日は{studyPercentage}%の時間を勉強に使いました。この調子で頑張りましょう！
                          </p>
                        </div>
                      ) : studyPercentage >= 50 ? (
                        <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                          <p className="text-secondary font-medium">良いペースです</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            勉強時間は{studyPercentage}%でした。もう少し集中時間を増やせそうですね。
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-destructive font-medium">集中力を高めましょう</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            今日の勉強時間は{studyPercentage}%でした。明日はもっと集中して取り組みましょう！
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apps Management Tab */}
          <TabsContent value="apps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>カテゴリ管理</CardTitle>
                <CardDescription>アプリを分類するためのカテゴリを管理します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          カテゴリを追加
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>新しいカテゴリを追加</DialogTitle>
                          <DialogDescription>カテゴリ名を入力してください</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="category-name">カテゴリ名</Label>
                            <Input
                              id="category-name"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="例: 趣味"
                              onKeyDown={(e) => e.key === "Enter" && addCategory()}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={addCategory}>追加</Button>
                            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                              キャンセル
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        {!["study", "break", "other"].includes(category.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategory(category.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {categories
              .filter((cat) => cat.id !== "other")
              .map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}アプリの管理
                    </CardTitle>
                    <CardDescription>{category.name}に分類するアプリを登録・管理します</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Dialog
                          open={isDialogOpen && selectedCategory === category.id}
                          onOpenChange={(open) => {
                            setIsDialogOpen(open)
                            if (open) setSelectedCategory(category.id)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedCategory(category.id)}>
                              <Plus className="h-4 w-4 mr-2" />
                              アプリを追加
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{category.name}アプリを追加</DialogTitle>
                              <DialogDescription>{category.name}に分類するアプリ名を入力してください</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="app-name">アプリ名</Label>
                                <Input
                                  id="app-name"
                                  value={newApp}
                                  onChange={(e) => setNewApp(e.target.value)}
                                  placeholder="例: Visual Studio Code"
                                  onKeyDown={(e) => e.key === "Enter" && addAppToCategory()}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={addAppToCategory}>追加</Button>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  キャンセル
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(categoryApps[category.id] || []).map((app, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">{app}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAppFromCategory(category.id, app)}
                              className="text-destructive hover:text-destructive"
                            >
                              削除
                            </Button>
                          </div>
                        ))}
                        {(!categoryApps[category.id] || categoryApps[category.id].length === 0) && (
                          <div className="col-span-full text-center text-muted-foreground py-8">
                            まだアプリが登録されていません
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  その他
                </CardTitle>
                <CardDescription>
                  上記のカテゴリに登録されていないアプリは自動的に「その他」として分類されます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    新しく検出されたアプリや、どのカテゴリにも登録されていないアプリは「その他」として表示されます。
                    必要に応じて適切なカテゴリに移動させることができます。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Report Tab */}
          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  週間の学習パターン
                </CardTitle>
                <CardDescription>過去7日間の勉強時間と非勉強時間の推移</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockDailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}時間`, ""]} />
                    <Bar dataKey="study" fill="hsl(var(--chart-1))" name="勉強時間" />
                    <Bar dataKey="nonStudy" fill="hsl(var(--chart-3))" name="非勉強時間" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Report Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>月間レポート</CardTitle>
                <CardDescription>過去4週間の学習時間の推移</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockWeeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}時間`, ""]} />
                    <Line
                      type="monotone"
                      dataKey="study"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      name="勉強時間"
                    />
                    <Line
                      type="monotone"
                      dataKey="nonStudy"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={3}
                      name="非勉強時間"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>月間サマリー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>総勉強時間</span>
                      <span className="font-bold text-primary">133時間</span>
                    </div>
                    <div className="flex justify-between">
                      <span>平均勉強時間/日</span>
                      <span className="font-bold">4.8時間</span>
                    </div>
                    <div className="flex justify-between">
                      <span>最長勉強日</span>
                      <span className="font-bold">7.2時間</span>
                    </div>
                    <div className="flex justify-between">
                      <span>勉強効率</span>
                      <span className="font-bold text-secondary">71%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>改善提案</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm font-medium text-primary">継続的な成長</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        先週と比較して勉強時間が8%増加しています。素晴らしい進歩です！
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                      <p className="text-sm font-medium text-secondary">集中時間の最適化</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        午前中の集中力が高い傾向があります。重要なタスクは午前中に行うことをお勧めします。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
