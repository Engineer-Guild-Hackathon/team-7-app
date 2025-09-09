import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: Request) {
    const { messages } = await req.json();

    const userContent = messages.map((m: any) => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`).join("\n");

    const prompt = `
    あなたは目標設定のアシスタントです。
    以下の会話から目標の項目を抽出し、**JSONのみ** を返してください。

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

    会話:
    ${userContent}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
        const goal = JSON.parse(text);
        return NextResponse.json({ type: "goal", goal });
    } catch {
        return NextResponse.json({ type: "error", text });
    }
}
