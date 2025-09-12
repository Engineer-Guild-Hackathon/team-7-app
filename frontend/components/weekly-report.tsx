"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// APIから受け取るデータの型定義
interface ChartData {
  week: string;
  study: number;
  nonStudy: number;
}
interface SummaryData {
  totalStudyHours: number;
  averageStudyHours: number;
  longestStudyHours: number;
  studyPercentage: number;
}
interface Suggestion {
    title: string;
    description: string;
}
interface MonthlyData {
  chartData: ChartData[];
  summary: SummaryData;
  suggestions: Suggestion[];
}

// ローディングとエラー表示用の汎用コンポーネント
const CardPlaceholder = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">{children}</p>
    </div>
);

export function WeeklyReport() {
    const [data, setData] = useState<MonthlyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const response = await fetch('/api/weekly-suumary');
                if (!response.ok) {
                    throw new Error('データの取得に失敗しました。');
                }
                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
                console.error("月間データの取得に失敗:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMonthlyData();
    }, []);

    return (
        <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle>月間レポート</CardTitle>
            <CardDescription>過去4週間の活動の推移とサマリー</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <CardPlaceholder>データを読み込み中...</CardPlaceholder>}
              {error && <CardPlaceholder>エラー: {error}</CardPlaceholder>}
              {data && (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis unit="h" />
                    <Tooltip 
                        formatter={(value: number) => [`${value} 時間`, ""]}
                        contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))"
                        }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Line type="monotone" dataKey="study" stroke="#3b82f6" strokeWidth={3} name="勉強時間" />
                    <Line type="monotone" dataKey="nonStudy" stroke="#9ca3af" strokeWidth={3} name="非勉強時間" />
                    </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
            <CardHeader>
                <CardTitle>月間サマリー</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <p>計算中...</p>}
                {error && <p className="text-destructive">計算エラー</p>}
                {data && (
                    <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>総勉強時間</span>
                        <span className="font-bold text-primary">{data.summary.totalStudyHours}時間</span>
                    </div>
                    <div className="flex justify-between">
                        <span>平均勉強時間/日</span>
                        <span className="font-bold">{data.summary.averageStudyHours}時間</span>
                    </div>
                    <div className="flex justify-between">
                        <span>最長勉強日</span>
                        <span className="font-bold">{data.summary.longestStudyHours}時間</span>
                    </div>
                    <div className="flex justify-between">
                        <span>勉強効率</span>
                        <span className="font-bold text-secondary">{data.summary.studyPercentage}%</span>
                    </div>
                    </div>
                )}
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>改善提案</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <p>分析中...</p>}
                {error && <p className="text-destructive">分析エラー</p>}
                {data && (
                    <div className="space-y-3">
                    {data.suggestions.map((s, index) => (
                        <div key={index} className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                            <p className="text-sm font-medium text-primary">{s.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                        </div>
                    ))}
                    </div>
                )}
            </CardContent>
            </Card>
        </div>
        </div>
    )
}
