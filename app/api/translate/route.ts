import { MAX_TEXT_LENGTH, TARGET_LANGUAGES } from "@/lib/constants";
import { translateWithDeepL } from "@/lib/deepl";
import type {
  TargetLangCode,
  TranslateRequest,
  TranslateResponse,
} from "@/lib/types";

const VALID_CODES = new Set<string>(TARGET_LANGUAGES.map((l) => l.code));

/**
 * POST /api/translate
 * 日本語テキストを DeepL で翻訳する。DEEPL_API_KEY 未設定時はモック翻訳を返し、
 * キーがなくても UI のデモができるようにする。
 */
export async function POST(request: Request): Promise<Response> {
  let payload: Partial<TranslateRequest>;
  try {
    payload = (await request.json()) as Partial<TranslateRequest>;
  } catch {
    return jsonError("リクエストボディが不正です", 400);
  }

  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const targetLang = payload.targetLang;

  if (!text) {
    return jsonError("翻訳する文章を入力してください", 400);
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return jsonError(
      `文章が長すぎます（${MAX_TEXT_LENGTH.toLocaleString()}文字以内にしてください）`,
      400
    );
  }
  if (!targetLang || !VALID_CODES.has(targetLang)) {
    return jsonError("翻訳先の言語が不正です", 400);
  }

  // DEEPL_API_KEY が無ければモックを返す（デモ用）。
  if (!process.env.DEEPL_API_KEY) {
    const body: TranslateResponse = {
      translatedText: buildMockTranslation(text),
      mock: true,
    };
    return Response.json(body);
  }

  try {
    // TODO: 長文は段落単位で分割送信する余地あり（MVP では一括送信）。
    const translatedText = await translateWithDeepL(
      text,
      targetLang as TargetLangCode
    );
    const body: TranslateResponse = { translatedText, mock: false };
    return Response.json(body);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "翻訳中にエラーが発生しました";
    return jsonError(message, 502);
  }
}

function jsonError(error: string, status: number): Response {
  const body: TranslateResponse = { translatedText: "", mock: false, error };
  return Response.json(body, { status });
}

/** DeepL 未接続時のダミー翻訳（原文に注記を添えて返す） */
function buildMockTranslation(text: string): string {
  return `【DeepL未接続（モック翻訳）】\nDEEPL_API_KEY を設定すると実際の翻訳が表示されます。\n\n--- 原文 ---\n${text}`;
}
