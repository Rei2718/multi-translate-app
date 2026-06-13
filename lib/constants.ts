import type { DocType, LangOption } from "@/lib/types";

/** 翻訳元は労働文書なので日本語に固定 */
export const SOURCE_LANG = "JA" as const;

/**
 * 翻訳先言語の一覧。
 * すべて DeepL API が対応する言語コードに対応している。
 * 在留外国人労働者に多い言語を中心に選定。
 */
export const TARGET_LANGUAGES: LangOption[] = [
  { code: "VI", label: "ベトナム語", nativeName: "Tiếng Việt" },
  { code: "ZH-HANS", label: "中国語（簡体字）", nativeName: "简体中文" },
  { code: "EN-US", label: "英語", nativeName: "English" },
  { code: "KO", label: "韓国語", nativeName: "한국어" },
  { code: "PT-BR", label: "ポルトガル語（ブラジル）", nativeName: "Português" },
  { code: "ID", label: "インドネシア語", nativeName: "Bahasa Indonesia" },
];

/** 対応する文書の種類 */
export const DOC_TYPES: DocType[] = [
  { id: "employment-contract", label: "労働契約書" },
  { id: "workplace-manual", label: "職場マニュアル" },
  { id: "work-rules", label: "就業規則" },
  { id: "other", label: "その他" },
];

/**
 * DeepL API Free のリクエスト 1 回あたりに送る文字数の上限（目安）。
 * 無料枠は月 50 万文字。1 回の送信でも巨大なリクエストは弾く。
 */
export const MAX_TEXT_LENGTH = 30000;

/** コードから言語の表示ラベルを引く */
export function getLangLabel(code: string): string {
  return TARGET_LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

/** id から文書種別の表示ラベルを引く */
export function getDocTypeLabel(id: string): string {
  return DOC_TYPES.find((d) => d.id === id)?.label ?? id;
}
