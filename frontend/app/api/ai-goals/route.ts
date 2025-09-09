import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const userContent = messages.map((m: any) => `${m.role}: ${m.content}`).join("\n");

        const prompt = `
    あなたは目標設定のアシスタントです。
    ユーザーと対話しながら目標の項目（タイトル・理由・成果・範囲・期限・サブゴールなど）を聞き出してください。

    - まだ全ての項目が揃っていない場合は、自然な日本語で続きを質問してください。
    - 必要な情報がすべて揃ったら、以下のフォーマットで **JSONのみ** を返してください。
    - JSON以外のテキストは一切含めないでください。

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

        // JSON かどうか判定
        let isJson = false;
        let goal = null;

        try {
        goal = JSON.parse(text);
        isJson = true;
        } catch {
        // JSONじゃなければ普通の返答として扱う
        }

        if (isJson) {
        return NextResponse.json({ type: "goal", goal });
        } else {
        return NextResponse.json({ type: "message", text });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "目標生成に失敗しました" }, { status: 500 });
    }
}
