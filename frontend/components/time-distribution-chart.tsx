"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface Category {
    id: string
    name: string
    color: string
}

interface TimeDistributionChartProps {
    pieData: Array<{
        name: string
        value: number
        color: string
    }>
}

export function TimeDistributionChart({ pieData }: TimeDistributionChartProps) {
    return (
        <Card>
        <CardHeader>
            <CardTitle>今日の時間配分</CardTitle>
            <CardDescription>カテゴリ別の時間配分</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Math.floor(Number(value) / 3600)}時間${Math.floor((Number(value) % 3600) / 60)}分`, ""]} />
            </PieChart>
            </ResponsiveContainer>
        </CardContent>
        </Card>
    )
}
