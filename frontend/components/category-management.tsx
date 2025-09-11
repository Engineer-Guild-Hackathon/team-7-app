"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"

interface Category {
    id: string
    name: string
    color: string
}

interface CategoryManagementProps {
    categories: Category[]
    newCategoryName: string
    setNewCategoryName: (name: string) => void
    newCategoryColor: string
    setNewCategoryColor: (color: string) => void
    isCategoryDialogOpen: boolean
    setIsCategoryDialogOpen: (open: boolean) => void
    addCategory: () => void
    removeCategory: (categoryId: string) => void
}

export function CategoryManagement({
    categories,
    newCategoryName,
    setNewCategoryName,
    newCategoryColor,
    setNewCategoryColor,
    isCategoryDialogOpen,
    setIsCategoryDialogOpen,
    addCategory,
    removeCategory,
}: CategoryManagementProps) {
    return (
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
                    {/* 色選択 */}
                    <div>
                        <Label htmlFor="category-color">色</Label>
                        <input
                            id="category-color"
                            type="color"
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className="w-12 h-8 border rounded"
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
                {/* その他カテゴリを常に一番下に */}
                {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium">{category.name}</span>
                    </div>
                    {!["study", "other"].includes(category.id) && (
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
    )
}
