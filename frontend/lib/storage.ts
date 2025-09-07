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

interface AppData {
  goals: Goal[]
  lastUpdated: string
  version: string
}

const STORAGE_KEY = "learning-goals-app-data"
const CURRENT_VERSION = "1.0.0"

export const storage = {
  // データを保存
  saveData: (goals: Goal[]): void => {
    try {
      const data: AppData = {
        goals,
        lastUpdated: new Date().toISOString(),
        version: CURRENT_VERSION,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("データの保存に失敗しました:", error)
    }
  },

  // データを読み込み
  loadData: (): Goal[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const data: AppData = JSON.parse(stored)

      // バージョンチェック（将来のマイグレーション用）
      if (data.version !== CURRENT_VERSION) {
        console.warn("データバージョンが異なります。マイグレーションが必要な場合があります。")
      }

      return data.goals || []
    } catch (error) {
      console.error("データの読み込みに失敗しました:", error)
      return []
    }
  },

  // データをエクスポート
  exportData: (): string => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored || "{}"
    } catch (error) {
      console.error("データのエクスポートに失敗しました:", error)
      return "{}"
    }
  },

  // データをインポート
  importData: (jsonString: string): Goal[] => {
    try {
      const data: AppData = JSON.parse(jsonString)
      if (data.goals && Array.isArray(data.goals)) {
        storage.saveData(data.goals)
        return data.goals
      }
      throw new Error("無効なデータ形式です")
    } catch (error) {
      console.error("データのインポートに失敗しました:", error)
      throw error
    }
  },

  // データをクリア
  clearData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("データのクリアに失敗しました:", error)
    }
  },
}
