import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { conversationTalkMemory } from "@/lib/conversation-talk-memory";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

type Message = {
    role: "user" | "AI";
    content: string;
};

export async function POST(req: Request) {
    try {
        const { conversation } = await req.json();

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
            ${conversation}
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();

            /* JSON 部分だけを抜き出し */
            const jsonMatch = text.match(/\{(?:[^{}]|{[^{}]*})*\}/s);
            if (!jsonMatch) {
                return NextResponse.json({ type: "incomplete", text });
            }

            const goal = JSON.parse(jsonMatch[0]);
            /* 全ての項目が埋まっているかを確認 */
            if (!goal.title || !goal.reason || !goal.outcome || !goal.scope || !goal.deadline) {
                return NextResponse.json({ type: "incomplete", text })
            }
            return NextResponse.json({ type: "goal", goal });
    } catch (e: unknown) {
        console.log("Goal API error:", e);
        return NextResponse.json({ type: "error", text: String(e) });
    }
}
