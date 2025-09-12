"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppUsage {
    id: number
    name: string
    time: number
    type: string
}

interface Category {
    id: string
    name: string
    color: string
}

interface AppUsageChartProps {
    appUsage: AppUsage[]
    categories: Category[]
    updateAppCategory: (appName: string, newType: string) => void
}

export function AppUsageChart({ appUsage, categories, updateAppCategory }: AppUsageChartProps) {
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

    return (
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
                    {Math.floor(app.time / 3600)}時間{Math.floor(app.time / 60)}分
                    </span>
                    <Select value={app.type} onValueChange={(value) => updateAppCategory(app.name, value)}>
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
    )
}
