"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"

const mockDailyData = [
    { name: "月", study: 4.5, nonStudy: 3.5 },
    { name: "火", study: 6.2, nonStudy: 2.8 },
    { name: "水", study: 3.8, nonStudy: 4.2 },
    { name: "木", study: 5.5, nonStudy: 2.5 },
    { name: "金", study: 4.0, nonStudy: 4.0 },
    { name: "土", study: 7.2, nonStudy: 1.8 },
    { name: "日", study: 5.8, nonStudy: 3.2 },
]

export function DailyReport() {
    return (
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
    )
}
