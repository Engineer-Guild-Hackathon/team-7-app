"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockWeeklyData = [
    { week: "第1週", study: 32, nonStudy: 18 },
    { week: "第2週", study: 28, nonStudy: 22 },
    { week: "第3週", study: 35, nonStudy: 15 },
    { week: "第4週", study: 38, nonStudy: 12 },
]

export function WeeklyReport() {
    return (
        <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle>月間レポート</CardTitle>
            </CardHeader>
            <CardContent>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}時間`, ""]} />
                <Line type="monotone" dataKey="study" stroke="hsl(var(--chart-1))" strokeWidth={3} name="勉強時間" />
                <Line type="monotone" dataKey="nonStudy" stroke="hsl(var(--chart-3))" strokeWidth={3} name="非勉強時間" />
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
        </div>
    )
}
