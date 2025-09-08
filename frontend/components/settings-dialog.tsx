"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, Shield, Palette, Database } from "lucide-react"

interface Settings {
    notifications: boolean
    autoBreakReminder: boolean
    breakInterval: number
    dailyGoalReminder: boolean
    weeklyReport: boolean
    dataRetention: number
    theme: string
    language: string
    exportFormat: string
}

interface SettingsDialogProps {
    isSettingsOpen: boolean
    setIsSettingsOpen: (open: boolean) => void
    settings: Settings
    updateSetting: (key: string, value: any) => void
    exportData: () => void
    resetAllData: () => void
}

export function SettingsDialog({
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    updateSetting,
    exportData,
    resetAllData,
}: SettingsDialogProps) {
    return (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <div className="p-1 bg-primary rounded">
                <div className="h-4 w-4 text-primary-foreground" />
                </div>
                アプリケーション設定
            </DialogTitle>
            <DialogDescription>StudyTime Trackerの動作をカスタマイズできます</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
            {/* 通知設定 */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-4 w-4" />
                    通知設定
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                    <Label htmlFor="notifications">通知を有効にする</Label>
                    <p className="text-sm text-muted-foreground">アプリからの通知を受け取ります</p>
                    </div>
                    <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting("notifications", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                    <Label htmlFor="break-reminder">休憩リマインダー</Label>
                    <p className="text-sm text-muted-foreground">定期的に休憩を促します</p>
                    </div>
                    <Switch
                    id="break-reminder"
                    checked={settings.autoBreakReminder}
                    onCheckedChange={(checked) => updateSetting("autoBreakReminder", checked)}
                    />
                </div>

                {settings.autoBreakReminder && (
                    <div className="ml-4 space-y-2">
                    <Label htmlFor="break-interval">休憩間隔（分）</Label>
                    <Input
                        id="break-interval"
                        type="number"
                        value={settings.breakInterval}
                        onChange={(e) => updateSetting("breakInterval", Number(e.target.value))}
                        min="15"
                        max="180"
                        className="w-24"
                    />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                    <Label htmlFor="goal-reminder">目標達成リマインダー</Label>
                    <p className="text-sm text-muted-foreground">日次目標の進捗を通知します</p>
                    </div>
                    <Switch
                    id="goal-reminder"
                    checked={settings.dailyGoalReminder}
                    onCheckedChange={(checked) => updateSetting("dailyGoalReminder", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                    <Label htmlFor="weekly-report">週次レポート</Label>
                    <p className="text-sm text-muted-foreground">毎週の学習レポートを送信します</p>
                    </div>
                    <Switch
                    id="weekly-report"
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) => updateSetting("weeklyReport", checked)}
                    />
                </div>
                </CardContent>
            </Card>

            {/* 外観設定 */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Palette className="h-4 w-4" />
                    外観設定
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="theme">テーマ</Label>
                    <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">ライト</SelectItem>
                        <SelectItem value="dark">ダーク</SelectItem>
                        <SelectItem value="system">システム設定に従う</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="language">言語</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </CardContent>
            </Card>

            {/* データ管理 */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-4 w-4" />
                    データ管理
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="data-retention">データ保持期間（日）</Label>
                    <Input
                    id="data-retention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => updateSetting("dataRetention", Number(e.target.value))}
                    min="7"
                    max="365"
                    className="w-24"
                    />
                    <p className="text-sm text-muted-foreground">指定した日数を過ぎたデータは自動的に削除されます</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="export-format">エクスポート形式</Label>
                    <Select value={settings.exportFormat} onValueChange={(value) => updateSetting("exportFormat", value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button onClick={exportData} variant="outline">
                    データをエクスポート
                    </Button>
                    <Button onClick={resetAllData} variant="destructive">
                    すべてのデータを削除
                    </Button>
                </div>
                </CardContent>
            </Card>

            {/* プライバシー設定 */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-4 w-4" />
                    プライバシー設定
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">データの取り扱いについて</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• すべてのデータはローカルに保存されます</li>
                    <li>• 外部サーバーへの送信は行いません</li>
                    <li>• アプリの使用状況は匿名化されて分析されます</li>
                    <li>• データの削除はいつでも可能です</li>
                    </ul>
                </div>
                </CardContent>
            </Card>
            </div>

            <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                キャンセル
            </Button>
            <Button onClick={() => setIsSettingsOpen(false)}>設定を保存</Button>
            </div>
        </DialogContent>
        </Dialog>
    )
}
