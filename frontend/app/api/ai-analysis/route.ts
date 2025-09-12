// app/api/ai-analysis/route.ts
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

interface usageData {
    app: string
    category: string
    time: number
}

export async function POST(req: Request) {
    const { usageData }: { usageData: usageData[] } = await req.json()

    usageData.forEach(d => {
        console.log(d.app, d.category, d.time);
    });

    const prompt = `
    あなたは学習アシスタントです。
    以下は今日のアプリ使用時間データです。
    ユーザーに今日の勉強時間と良かったことをほめたり，改善点をフィードバックしてください．
    ユーザーへのコメントは簡潔にしてください
    マークダウン形式で表示してください

    データ:
    ${usageData.map((d: usageData) => `${d.app} (${d.category}): ${d.time}分`).join("\n")}
    `

    const result = await model.generateContent(prompt)
    return NextResponse.json({ feedback: result.response.text() })
}
