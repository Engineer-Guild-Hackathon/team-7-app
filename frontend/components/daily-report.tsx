"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Calendar } from "lucide-react"

// グラフで表示するデータの型を定義
interface DailyData {
    name: string;      // 曜日 (例: "月")
    study: number;     // 勉強時間 (時間単位)
    nonStudy: number;  // 非勉強時間 (時間単位)
}

export function DailyReport() {
    const [data, setData] = useState<DailyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeeklyData = async () => {
            try {
                // 新しく作成したAPIエンドポイントを呼び出す
                const response = await fetch('/api/daily-summary');
                if (!response.ok) {
                    throw new Error('データの取得に失敗しました。');
                }
                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
                console.error("週間データの取得に失敗:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeeklyData();
    }, []); // コンポーネントがマウントされた時に一度だけ実行

    const renderChart = () => {
        if (isLoading) {
            return <div className="flex items-center justify-center h-full"><p>データを読み込み中...</p></div>;
        }

        if (error) {
            return <div className="flex items-center justify-center h-full"><p className="text-destructive">エラー: {error}</p></div>;
        }
        
        if (data.length === 0) {
            return <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">表示するデータがありません。</p></div>;
        }

        return (
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="h" />
                    <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)} 時間`, ""]}
                        contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))"
                        }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="study" fill="#4f86f7" name="勉強時間" stackId="a" />
                    <Bar dataKey="nonStudy" fill="#a0a0a0" name="非勉強時間" stackId="a" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
    return (
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            週間の学習パターン
            </CardTitle>
            <CardDescription>過去7日間の勉強時間と非勉強時間の推移</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
            {renderChart()}
        </CardContent>
        </Card>
    );
}
