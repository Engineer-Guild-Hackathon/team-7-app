import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/* sessionIDごとに会話を記録 */
const conversationMemory: Record<string, { role: string; content: string }[]> = {};


export async function POST(req: Request) {
    const { sessionId, messages } = await req.json();

    // セッションの履歴がなければ初期化
    if (!conversationMemory[sessionId]) conversationMemory[sessionId] = [];

    // 最新のユーザー入力だけを取り出す
    const latestUserMessage = messages[messages.length - 1];

    // 過去の会話（AIとユーザーの履歴）をフォーマット
    const pastConversation = conversationMemory[sessionId]
        .map(m => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`)
        .join("\n");

    // AIに渡すプロンプト：過去の会話 + 最新ユーザー入力
    const prompt = `
        あなたは目標設定をサポートするアシスタントです。
        会話はできるだけ短く自然に行ってください。
        以下の流れでユーザーから情報を引き出してください：

        1. ユーザーの「目標」を聞き出す
        2. 目標を達成したい理由を深掘りする
        3. 目標達成後の理想の状態や次の目標を聞き出す
        4. 最終目標に到達するための小目標を一緒に考える

        - まだ全て揃っていない場合はJSONを返さず会話を促してください

        過去の会話：
        ${pastConversation}

        ユーザーの最新発言：
        ユーザー: ${latestUserMessage.content}
        `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 履歴に追加
    conversationMemory[sessionId].push({ role: "user", content: latestUserMessage.content });
    conversationMemory[sessionId].push({ role: "AI", content: text });

    return NextResponse.json({ text });
}

