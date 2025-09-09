import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: Request) {
    const { messages } = await req.json();

    // 過去の会話を「ユーザー」「AI」でフォーマット
    const formattedConversation = messages
        .map((m: any) => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`)
        .join("\n");

    const prompt = `
        あなたは目標設定のアシスタントです。
        以下の過去の会話から、目標設定に必要な項目を抽出してください。
        **必ずJSONのみ**を返してください。文章や補足は返さないでください。

        抽出するJSONのフォーマット：
        {
        "id": "string (ユニークID)",
        "title": "string",
        "reason": "string",
        "outcome": "string",
        "scope": "string",
        "deadline": "YYYY-MM-DD",
        "progress": 0,
        "subGoals": [
            { "id": "string", "title": "string", "completed": false, "dueDate": "YYYY-MM-DD" }
        ],
        "createdAt": "ISO 8601"
        }

        過去の会話：
        ${formattedConversation}
        `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    /* JSON 部分だけを抜き出し */
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return NextResponse.json({ type: "error", text });
    }
    try {
        const goal = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ type: "goal", goal });
    } catch (e) {
        return NextResponse.json({ type: "error", text, error: String(e) });
    }
}
