"use client"

import { useState, useEffect, useCallback } from "react"
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

interface AppUsage {
  id: number;
  name: string;
  time: number;
  type: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function ScreenTimeApp() {
  const [categories, setCategories] = useState([
  { id: "study", name: "勉強", color: "#4f86f7" },
  { id: "other", name: "その他", color: "#a0a0a0" },
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
  const [appUsage, setAppUsage] = useState<AppUsage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE_URL = 'http://localhost:3000';

  const fetchUsageData = useCallback(async () => {
    console.log("アプリ使用時間データを取得中...");
    // データ取得前にエラーをリセット
    setError(null); 
    try {
      const res = await fetch(`${API_BASE_URL}/api/app-usage`);
      if (!res.ok) throw new Error(`APIサーバーからの応答がありません (ステータス: ${res.status})`);
      const data: AppUsage[] = await res.json();

      console.log(`[成功] ${data.length}件のデータを取得しました。`, data);

      setAppUsage(data);
    } catch (err: any) {
      console.error("アプリ使用時間の取得に失敗:", err);
      setError("サーバーへの接続に失敗しました。APIサーバーが起動しているか確認してください。");
    } finally {
      // 常にローディングを終了
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => {
    // コンポーネント表示時にデータを取得
    fetchUsageData(); 
    // 30秒ごとに自動でデータを更新
    const intervalId = setInterval(fetchUsageData, 30000); 
    // コンポーネントが非表示になったら定期更新を停止
    return () => clearInterval(intervalId);
  }, [fetchUsageData]);

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

   const updateAppCategory = async (appName: string, newType: string) => {
    console.log(`[更新開始] アプリ名: ${appName}, 新カテゴリ: ${newType}`);
    // 1. 【先に】現在のstateから更新対象のアプリ情報を探す
    const appToUpdate = appUsage.find(app => app.name === appName);

    // もし対象のアプリが見つからなければ、処理を中断
    if (!appToUpdate) {
      console.error(`更新対象のアプリ(ID: ${appName})が見つかりませんでした。`);
      return;
    }

    // 2. ユーザー操作に即時反応するための「先行更新」
    setAppUsage(prev => 
      prev.map(app => (app.name === appName ? { ...app, type: newType } : app))
    );

    try {
      console.log(`[API送信] アプリ名: ${appToUpdate.name}, 新カテゴリ: ${newType}`);

      // 3. 【後に】見つけておいたアプリ名を使ってAPIにリクエストを送信
      const res = await fetch(`${API_BASE_URL}/api/update-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: appToUpdate.name, newType }), // 正しいappNameを渡せる
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'カテゴリ更新APIの呼び出しに失敗');
      }

      await fetchUsageData();

    } catch (err) {
      console.error("カテゴリの更新に失敗しました:", err);
      setError("カテゴリの更新に失敗しました。サーバーとの接続を確認してください。");
      await fetchUsageData();
    }
  };
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

  const updateCategoryColor = (categoryId: string, color: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, color } : cat
      )
    )
  }

  const analyzeWithAI = async () => {
    setAiAnalysisLoading(true)
    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usageData: appUsage.map(app => ({
            app: app.name,
            category: app.type,
            time: app.time
          }))
        }),
      })
      const data = await res.json()
      setAiAnalysisResult(data.feedback)
    } catch (err) {
      console.error(err)
    } finally {
      setAiAnalysisLoading(false)
    }
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
    // confirmダイアログは使用せず、ボタンが押されたら即時実行する
    console.warn("データリセットが実行されました。将来的にはAPIを呼び出すように実装してください。");
    
    // フロントエンドの表示を空にする
     setAppUsage([]);

    // 他の関連Stateも初期状態に戻す
    setCategories([
      { id: "study", name: "勉強", color: "#4f86f7" },
      { id: "other", name: "その他", color: "#a0a0a0" },
    ]);
    setCategoryApps({
      study: ["Visual Studio Code", "Chrome (学習サイト)", "Notion"],
      break: ["YouTube", "Discord"],
    });
    setAiAnalysisResult("");
    setIsSettingsOpen(false); // ダイアログを閉じる
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">データを読み込み中...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
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
              updateCategoryColor={updateCategoryColor}
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
