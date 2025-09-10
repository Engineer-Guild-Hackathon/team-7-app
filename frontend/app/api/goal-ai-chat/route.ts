import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
//import {conversationTalkMemory } from "@/lib/conversation-talk-memory";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req: Request) {
    const { conversation, latestMessage } = await req.json();

    console.log("履歴: ", conversation);
    console.log("最新入力: ", latestMessage);

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
        - 自然で簡潔な会話をしてください
        - これまでの会話を元に会話してください

        会話の終わりの段階（全ての情報が揃った場合）では：

        - 最終目標に到達するための「小目標」を段階的にいくつか提案する
        - 小目標の提示はユーザに見やすいように行ってください
        - ユーザーがその小目標に承諾したら、「AIが提案する目標を作成」ボタンを押すよう促す
        - 会話は自然で簡潔に行うこと

        これまでの会話：
        ${conversation}

        ユーザーの最新の発言：
        ユーザー: ${latestMessage}

        次にどう返答するか、自然に会話を進めてください。
        必要に応じて、小目標の提案やボタン押下の案内も含めてください。
        `



    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
}

