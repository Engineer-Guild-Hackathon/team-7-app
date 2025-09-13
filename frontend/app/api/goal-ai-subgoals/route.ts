import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: Request) {
        const { status, deadline } = await req.json();

        const prompt = `
            あなたは目標設定のアシスタントです。
            ユーザーが達成したい目標は "${status}" で、期限は "${deadline}" です。
            この目標を達成するための小目標を3～5個、段階的かつ実行可能な形で提案してください。
            ユーザーに返信する文章も自然に作ってください。

            出力は必ずJSON形式で返してください：
            {
            "reply": "ユーザーに返す自然な会話文",
            "subgoals": [
                {"step": 1, "title": "小目標タイトル", "detail": "具体的な内容"},
                ...
            ]
            }
            `;


        const result = await model.generateContent(prompt);
        const rawtext = result.response.text();

        let parsed;
        try {
    
            const jsonMatch = rawtext.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
        } catch (e) {
            console.log("Goal API error:", e);
            return NextResponse.json({ type: "error", text: String(e) });
        }

        return NextResponse.json(parsed);
}
