// このモジュールはサーバー専用（API route handler からのみ import する）。
// DEEPL_API_KEY を扱うため、クライアントコンポーネントから import しないこと。
import { SOURCE_LANG } from "@/lib/constants";
import type { TargetLangCode } from "@/lib/types";

/**
 * DeepL API Free のエンドポイント。
 * 無料枠のキー（末尾 ":fx"）は api-free ホストを使う。
 * Pro キーを使う場合は DEEPL_API_URL で上書きできる。
 */
const DEEPL_API_URL =
  process.env.DEEPL_API_URL ?? "https://api-free.deepl.com/v2/translate";

/**
 * DeepL で日本語テキストを target_lang へ翻訳する。サーバー専用。
 * 失敗時は呼び出し側（route handler）で捕捉できるよう例外を投げる。
 */
export async function translateWithDeepL(
  text: string,
  targetLang: TargetLangCode
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY が設定されていません");
  }

  const body = new URLSearchParams();
  body.append("text", text);
  body.append("source_lang", SOURCE_LANG);
  body.append("target_lang", targetLang);

  const res = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    // 文書は保存しない方針。キャッシュもしない。
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DeepL API エラー (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as {
    translations?: { text: string }[];
  };
  const translated = data.translations?.[0]?.text;
  if (!translated) {
    throw new Error("DeepL から翻訳結果を取得できませんでした");
  }
  return translated;
}
