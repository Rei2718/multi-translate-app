// このモジュールはサーバー専用（API route handler からのみ import する）。
// GEMINI_API_KEY を扱うため、クライアントコンポーネントから import しないこと。
import type { ChatMessage } from "@/lib/types";

/**
 * Gemini のストリーミング生成エンドポイント。
 * alt=sse で Server-Sent Events 形式のストリームを受け取る。
 * モデルは GEMINI_MODEL で上書き可能（既定は gemini-2.0-flash）。
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const GEMINI_API_BASE =
  process.env.GEMINI_API_BASE ??
  "https://generativelanguage.googleapis.com/v1beta";

/** Gemini API の最小限のレスポンス型（必要な部分のみ） */
interface GeminiStreamChunk {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

/**
 * Gemini にチャット履歴とシステムプロンプトを渡し、回答テキストを逐次 yield する。
 * サーバー専用。失敗時は呼び出し側（route handler）で捕捉できるよう例外を投げる。
 */
export async function* streamGemini(
  messages: ChatMessage[],
  systemPrompt: string
): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません");
  }

  const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    // Gemini は assistant ロールを "model" と表現する。
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini API エラー (${res.status}): ${detail}`);
  }

  // SSE ストリームを行単位でパースし、data: 行の JSON からテキストを取り出す。
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    // 最後の要素は途中の可能性があるので buffer に戻す。
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const json = trimmed.slice("data:".length).trim();
      if (!json || json === "[DONE]") continue;

      try {
        const chunk = JSON.parse(json) as GeminiStreamChunk;
        const text = chunk.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("");
        if (text) yield text;
      } catch {
        // パースできない行はスキップ（断片や空行）。
      }
    }
  }
}
