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
    const { conversation, latestMessage, prestatus } = await req.json();

    console.log("収集状況: ", prestatus);
    console.log("最新入力: ", latestMessage);
    console.log("会話履歴: ", conversation)

    // AIに渡すプロンプト：過去の会話 + 最新ユーザー入力
    const prompt = `
    あなたは目標設定のアシスタントです。

    ## 出力フォーマット
    必ず**JSONのみ**で返してください。余計な文章やマークダウンは一切付けないでください。

    {
    "reply": "ユーザーに返す自然な会話文",
    "status": "ユーザーから聞き出した達成期限"
    }

    "" タスク
    - ユーザーの最新の発言から「目標達成期限」を抽出してください
    - ユーザへは目標の情報をみて目標達成までの小目標を提案してください

    ## 入力情報
    - ユーザーの最新発言: "${latestMessage}"
    - 会話履歴: "${conversation}"
    - 目標の情報: "${prestatus}"

    ## ルール
    - 会話履歴を参照し，ユーザーの返答の参考とすること
    - 返答するときには，ユーザーの最新の発言に対して具体的に肯定的に反応すること
    - ユーザーは目標達成の期限を最新発言として入力しています

    ## 例(英語の勉強が目的の場合)
    {
    "reply": "ありがとうございます！期限は1年ですね！期限を意識すると計画が立てやすくなりますね．続けて，小目標を設定していきましょう！",
    "status": "1年後",
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

    /* 小目標提案用APIの呼び出し */
    let subgoalsResponse: any = null;
    try {
        const subRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subgoals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: { ...prestatus, deadline: parsed.status }
            }),
        });
        subgoalsResponse = await subRes.json();
    } catch (err) {
        console.error("小目標API呼び出しエラー: ", err);
    }

    return NextResponse.json({
        reply: parsed.reply,
        status: parsed.status,
        subgoalsReply: subgoalsResponse?.reply || "",
        subgoals: subgoalsResponse?.subgoals || []
    });
}

