/* 会話を記録しておくグローバル変数 */
export const conversationTalkMemory: Record<
    string,
    { role: string; content: string }[]
> = {};