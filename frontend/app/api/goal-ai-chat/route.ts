import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
//import {conversationTalkMemory } from "@/lib/conversation-talk-memory";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GOALAI!);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
        temperature: 0.4
    }
});

export async function POST(req: Request) {
    const { conversation, latestMessage, status } = await req.json();

    console.log("収集状況: ", status);
    console.log("最新入力: ", latestMessage);

    // AIに渡すプロンプト：過去の会話 + 最新ユーザー入力
    const prompt = `
    あなたは目標設定のアシスタントです。

    ## 出力フォーマット
    必ず**JSONのみ**で返してください。余計な文章やマークダウンは一切付けないでください。

    {
    "reply": "ユーザーに返す自然な会話文",
    "status": {
        "title": "string",
        "reason": "string",
        "outcome": "string",
        "scope": "string",
        "deadline": "string"
    }
    }

    ## 収集すべき情報（順番に聞き出す）
    1. 達成したい「目標」 (title)
    2. その目標を達成したい「理由」 (reason)
    3. 達成後に「何をしたいか」 (outcome)
    4. 目標の達成レベル（どの程度まで） (scope)
    5. 目標の「期限」 (deadline)

    ## 入力情報
    - ユーザーの最新発言: "${latestMessage}"
    - 会話履歴: "${conversation}"
    - 現在の収集状況: ${JSON.stringify(status)}

    ## ルール
    - 収集済みの項目は上書きせず保持する
    - 最新の発言から埋められる項目があれば必ず更新する
    - まだ埋まっていない情報を順番に自然に質問する
    - 収集が完了したら小目標を提案して、最終確認する
    - 必ずJSONのみで返し、余計な文章や説明を絶対に追加しない

    ## 例
    {
    "reply": "英語学習、いいですね！どんな理由で英語を身につけたいと思っていますか？",
    "status": {
        "title": "英語学習",
        "reason": "",
        "outcome": "",
        "scope": "",
        "deadline": ""
    }
    }
    `



    const result = await model.generateContent(prompt);
    const rawtext = result.response.text();

    console.log("純粋な返答: ", rawtext)
    let parsed;

    try {
          // モデルが余計な文字を付けた場合に備えて { ... } 部分だけ抽出
        const jsonMatch = rawtext.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
    } catch (e) {
        console.error("JSON parse error: ", e, rawtext);
        parsed = {
            reply: "すみません，もう一度お願いします．",
            status,
        }
    }

    return NextResponse.json({
        reply: parsed.reply,
        status: parsed.status,
    });
}

