import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

export async function formatTranslationAsMarkdown({
  translatedText,
  targetLangLabel,
  docTypeLabel,
}: {
  translatedText: string;
  targetLangLabel: string;
  docTypeLabel: string;
}): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `以下は${targetLangLabel}に翻訳済みの${docTypeLabel}です。この文書をMarkdown形式で整形してください。

重要: 文書は${targetLangLabel}で書かれています。絶対に日本語や他の言語に翻訳しないでください。${targetLangLabel}のまま整形してください。
見出し・箇条書き・表を適切に使い、読みやすく構造化してください。Markdownテキストのみ出力してください。

${translatedText}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
