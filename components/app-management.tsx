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
import { Plus } from "lucide-react"

interface Category {
    id: string
    name: string
    color: string
}

interface AppManagementProps {
    categories: Category[]
    categoryApps: Record<string, string[]>
    newApp: string
    setNewApp: (app: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    isDialogOpen: boolean
    setIsDialogOpen: (open: boolean) => void
    addAppToCategory: () => void
    removeAppFromCategory: (categoryId: string, appName: string) => void
}

export function AppManagement({
    categories,
    categoryApps,
    newApp,
    setNewApp,
    selectedCategory,
    setSelectedCategory,
    isDialogOpen,
    setIsDialogOpen,
    addAppToCategory,
    removeAppFromCategory,
}: AppManagementProps) {
    return (
        <>
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
        </>
    )
}
