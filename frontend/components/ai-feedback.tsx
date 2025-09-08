"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface AIFeedbackProps {
    studyPercentage: number;
    totalStudyTime: number;
    aiAnalysisLoading: boolean;
    aiAnalysisResult: string;
    analyzeWithAI: () => void;
}

export function AIFeedback({
    studyPercentage,
    totalStudyTime,
    aiAnalysisLoading,
    aiAnalysisResult,
    analyzeWithAI,
}: AIFeedbackProps) {
    return (
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AIからのフィードバック
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            <Button
                onClick={analyzeWithAI}
                disabled={aiAnalysisLoading}
                className="w-full"
            >
                {aiAnalysisLoading ? "分析中..." : "今日の活動データを分析して"}
            </Button>

            {aiAnalysisResult && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">
                    {aiAnalysisResult}
                </p>
                </div>
            )}

            {!aiAnalysisResult && !aiAnalysisLoading && (
                <div className="space-y-3">
                {studyPercentage >= 70 ? (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-primary font-medium">
                        素晴らしい集中力です！
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        今日は{studyPercentage}
                        %の時間を勉強に使いました。この調子で頑張りましょう！
                    </p>
                    </div>
                ) : studyPercentage >= 50 ? (
                    <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                    <p className="text-secondary font-medium">良いペースです</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        勉強時間は{studyPercentage}
                        %でした。もう少し集中時間を増やせそうですね。
                    </p>
                    </div>
                ) : (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive font-medium">
                        集中力を高めましょう
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        今日の勉強時間は{studyPercentage}
                        %でした。明日はもっと集中して取り組みましょう！
                    </p>
                    </div>
                )}
                </div>
            )}
            </div>
        </CardContent>
        </Card>
    );
}
