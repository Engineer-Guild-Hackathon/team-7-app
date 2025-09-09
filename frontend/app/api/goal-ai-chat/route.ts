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
        あなたは目標設定のアシスタントです。
        ユーザーと自然で短い会話をしながら、以下の情報を順に聞き出してください：

        1. ユーザーが達成したい「目標」
        2. その目標を達成したい「理由」
        3. 達成後に「何をしたいか」
        4. 目標の達成レベル（どの程度までやりたいか）
        5. 目標の「期限」

        - まだ全ての情報が揃っていない場合は、**JSONは返さずに**会話を続けてください。
        - ユーザーが答えに詰まった場合は、例や選択肢を提示してサポートしてください。

        会話の終わりの段階（全ての情報が揃った場合）では：

        - 最終目標に到達するための「小目標」を段階的にいくつか提案する
        - 小目標の提示はユーザに見やすいように行ってください
        - ユーザーがその小目標に承諾したら、「AIが提案する目標を作成」ボタンを押すよう促す
        - 会話は自然で簡潔に行うこと

        これまでの会話：
        ${pastConversation}

        ユーザーの最新の発言：
        ユーザー: ${latestUserMessage.content}

        次にどう返答するか、自然に会話を進めてください。
        必要に応じて、小目標の提案やボタン押下の案内も含めてください。
        `



    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 履歴に追加
    conversationMemory[sessionId].push({ role: "user", content: latestUserMessage.content });
    conversationMemory[sessionId].push({ role: "AI", content: text });

    return NextResponse.json({ text });
}

