"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AppManagement() {
  return (
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
  )
}
