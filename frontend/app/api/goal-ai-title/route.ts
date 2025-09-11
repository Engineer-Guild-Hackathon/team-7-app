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
    console.log("会話履歴: ", conversation)

    // AIに渡すプロンプト：過去の会話 + 最新ユーザー入力
    const prompt = `
    あなたは目標設定のアシスタントです。

    ## 出力フォーマット
    必ず**JSONのみ**で返してください。余計な文章やマークダウンは一切付けないでください。

    {
    "reply": "ユーザーに返す自然な会話文",
    "status": "ユーザーから聞き出した達成したい目標"
    }

    "" タスク
    - ユーザーの最新の発言から「目標を達成したい理由」を抽出してください
    - ユーザへはその目標を達成したらなにをしたいのかを聞くようにしてください

    ## 入力情報
    - ユーザーの最新発言: "${latestMessage}"
    - 会話履歴: "${conversation}"

    ## ルール
    - 会話履歴を参照し，ユーザーの返答の参考とすること
    - 返答するときには，ユーザーの最新の発言に対して具体的に肯定的に反応すること
    - ユーザーは目標を達成したい理由を最新発言として入力しています
    - 質問を行うときはその質問の返答の例を提案しながら質問してください

    ## 例
    {
    "reply": "英語を勉強したいんですね！例えば『TOEICの点数を上げたい』『日常会話をできるようにしたい』など、どんな目標を考えていますか？",
    "status": "英語学習",
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

