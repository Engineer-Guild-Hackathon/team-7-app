"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Settings } from "lucide-react"
import { GoalSetting } from "@/components/goal-setting"

import { DashboardOverview } from "@/components/dashboard-overview"
import { TimeDistributionChart } from "@/components/time-distribution-chart"
import { AppUsageChart } from "@/components/app-usage-chart"
import { AIFeedback } from "@/components/ai-feedback"
import { CategoryManagement } from "@/components/category-management"
import { AppManagement } from "@/components/app-management"
import { SettingsDialog } from "@/components/settings-dialog"
import { WeeklyReport } from "@/components/weekly-report"
import { DailyReport } from "@/components/daily-report"

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
  { id: "other", name: "その他", color: "hsl(var(--chart-2))" },
  ])

  /* 常にその他が一番下に来るようにソート */
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.id === "other") return 1
    if (b.id === "other") return -1
    return 0
  })

  const [newCategoryName, setNewCategoryName] = useState("")
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [studyGoal, setStudyGoal] = useState(8)
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
    breakInterval: 60,
    dailyGoalReminder: true,
    weeklyReport: true,
    dataRetention: 30,
    theme: "system",
    language: "ja",
    exportFormat: "json",
  })

  const updateAppCategory = (appId: number, newType: string) => {
    setAppUsage((prev) => prev.map((app) => (app.id === appId ? { ...app, type: newType } : app)))
  }

  const [newCategoryColor, setNewCategoryColor] = useState("#ff0000")

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newId = newCategoryName.toLowerCase().replace(/\s+/g, "_")
      const newCategory = {
        id: newId,
        name: newCategoryName.trim(),
        color: newCategoryColor,
      }
      setCategories([...categories, newCategory])
      setCategoryApps((prev) => ({ ...prev, [newId]: [] }))
      setNewCategoryName("")
      setNewCategoryColor("#ff0000")
      setIsCategoryDialogOpen(false)
    }
  }

  const removeCategory = (categoryId: string) => {
    if (["study", "break", "other"].includes(categoryId)) return
    setCategories(categories.filter((cat) => cat.id !== categoryId))
    setCategoryApps((prev) => {
      const newApps = { ...prev }
      delete newApps[categoryId]
      return newApps
    })
    setAppUsage((prev) => prev.map((app) => (app.type === categoryId ? { ...app, type: "other" } : app)))
  }

  const analyzeWithAI = async () => {
    setAiAnalysisLoading(true)
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
            <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">ダッシュボード</TabsTrigger>
            <TabsTrigger value="goals">目標設定</TabsTrigger>
            <TabsTrigger value="apps">アプリ管理</TabsTrigger>
            <TabsTrigger value="daily">日次レポート</TabsTrigger>
            <TabsTrigger value="weekly">週次レポート</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview
              totalStudyTime={totalStudyTime}
              totalNonStudyTime={totalNonStudyTime}
              studyPercentage={studyPercentage}
              studyGoal={studyGoal}
              setStudyGoal={setStudyGoal}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeDistributionChart pieData={pieData} />

              <AppUsageChart
                appUsage={appUsage}
                categories={sortedCategories}
                updateAppCategory={updateAppCategory}
              />
            </div>

            <AIFeedback
              studyPercentage={studyPercentage}
              totalStudyTime={totalStudyTime}
              aiAnalysisLoading={aiAnalysisLoading}
              aiAnalysisResult={aiAnalysisResult}
              analyzeWithAI={analyzeWithAI}
            />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <GoalSetting />
          </TabsContent>

          {/* Apps Management Tab */}
          <TabsContent value="apps" className="space-y-6">
            <CategoryManagement
              categories={sortedCategories}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              newCategoryColor={newCategoryColor}
              setNewCategoryColor={setNewCategoryColor}
              isCategoryDialogOpen={isCategoryDialogOpen}
              setIsCategoryDialogOpen={setIsCategoryDialogOpen}
              addCategory={addCategory}
              removeCategory={removeCategory}
            />

            <AppManagement
              categories={categories}
              categoryApps={categoryApps}
              newApp={newApp}
              setNewApp={setNewApp}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              addAppToCategory={addAppToCategory}
              removeAppFromCategory={removeAppFromCategory}
            />
          </TabsContent>

          {/* Daily Report Tab */}
          <TabsContent value="daily" className="space-y-6">
            <DailyReport />
          </TabsContent>

          {/* Weekly Report Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <WeeklyReport />
          </TabsContent>
        </Tabs>
      </div>

      <SettingsDialog
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        settings={settings}
        updateSetting={updateSetting}
        exportData={exportData}
        resetAllData={resetAllData}
      />
    </div>
  )
}
