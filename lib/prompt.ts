// 再翻訳用プロンプトの自動生成。AI API は呼ばず、文字列を組み立てるだけの純関数。
// ユーザーが自身の Claude / ChatGPT に貼り付けて使う。

export interface PromptParams {
  /** 文書種別の表示ラベル（例: 労働契約書） */
  docTypeLabel: string;
  /** 翻訳先言語の表示ラベル（例: ベトナム語） */
  targetLangLabel: string;
  /** 日本語の原文 */
  original: string;
  /** DeepL による下訳 */
  deeplDraft: string;
}

/**
 * 原文・DeepL 下訳・文書種別・翻訳先言語を組み合わせ、
 * より自然な再翻訳を AI に依頼するためのプロンプトを生成する。
 */
export function buildRetranslationPrompt({
  docTypeLabel,
  targetLangLabel,
  original,
  deeplDraft,
}: PromptParams): string {
  return `あなたは日本語と${targetLangLabel}に精通したプロの翻訳者です。
日本で働く外国人労働者が読むための「${docTypeLabel}」を、${targetLangLabel}へ正確かつ自然に翻訳してください。

# 指示
- 専門用語・法律用語・労務に関する語は正確に訳してください。
- 直訳ではなく、${targetLangLabel}のネイティブが自然に読める表現にしてください。
- 下記の「DeepLの下訳」を参考にしつつ、不自然・不正確な箇所を修正してください。
- 原文の意味を勝手に省略・追加しないでください。
- 専門用語で誤解を招きそうな箇所には、必要に応じて簡単な補足を ( ) で添えても構いません。

# 原文（日本語）
${original}

# DeepLの下訳（${targetLangLabel}）
${deeplDraft}

# 出力
修正後の${targetLangLabel}訳のみを出力してください。`;
}
