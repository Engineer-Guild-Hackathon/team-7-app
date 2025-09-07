"use client"

import { useState, useEffect, useCallback } from "react"
import { storage } from "@/lib/storage"

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

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // データを読み込み
  useEffect(() => {
    const loadedGoals = storage.loadData()
    setGoals(loadedGoals)
    setIsLoading(false)
  }, [])

  // データが変更されたときに自動保存
  useEffect(() => {
    if (!isLoading) {
      storage.saveData(goals)
    }
  }, [goals, isLoading])

  const addGoal = useCallback(
    (goalData: Omit<Goal, "id" | "createdAt" | "status" | "tasks" | "progress">, initialTasks?: Task[]) => {
      const tasks = initialTasks || []
      const completedTasks = tasks.filter((task) => task.completed).length
      const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "active",
        tasks,
        progress,
      }
      setGoals((prev) => [...prev, newGoal])
    },
    [],
  )

  // 目標を更新
  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)))
  }, [])

  // 目標を削除
  const deleteGoal = useCallback((goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
  }, [])

  // タスクを追加
  const addTask = useCallback((goalId: string, taskTitle: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedTasks = [...goal.tasks, newTask]
          const completedTasks = updatedTasks.filter((task) => task.completed).length
          const newProgress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0
          return { ...goal, tasks: updatedTasks, progress: newProgress }
        }
        return goal
      }),
    )
  }, [])

  // タスクの完了状態を切り替え
  const toggleTask = useCallback((goalId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedTasks = goal.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          )
          const completedTasks = updatedTasks.filter((task) => task.completed).length
          const newProgress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0
          const newStatus = newProgress === 100 ? "completed" : goal.status
          return { ...goal, tasks: updatedTasks, progress: newProgress, status: newStatus }
        }
        return goal
      }),
    )
  }, [])

  // タスクを削除
  const deleteTask = useCallback((goalId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedTasks = goal.tasks.filter((task) => task.id !== taskId)
          const completedTasks = updatedTasks.filter((task) => task.completed).length
          const newProgress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0
          return { ...goal, tasks: updatedTasks, progress: newProgress }
        }
        return goal
      }),
    )
  }, [])

  // データをエクスポート
  const exportData = useCallback(() => {
    const dataStr = storage.exportData()
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `learning-goals-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  // データをインポート
  const importData = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string
          const importedGoals = storage.importData(jsonString)
          setGoals(importedGoals)
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"))
      reader.readAsText(file)
    })
  }, [])

  // データをクリア
  const clearAllData = useCallback(() => {
    storage.clearData()
    setGoals([])
  }, [])

  return {
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
  }
}
