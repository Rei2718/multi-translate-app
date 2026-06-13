import { NextResponse } from "next/server";

import { formatTranslationAsMarkdown } from "@/lib/claude";

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY が設定されていません", markdown: "" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    translatedText?: string;
    targetLangLabel?: string;
    docTypeLabel?: string;
  };

  if (!body.translatedText?.trim()) {
    return NextResponse.json(
      { error: "翻訳テキストが空です", markdown: "" },
      { status: 400 },
    );
  }

  try {
    const markdown = await formatTranslationAsMarkdown({
      translatedText: body.translatedText,
      targetLangLabel: body.targetLangLabel ?? "",
      docTypeLabel: body.docTypeLabel ?? "",
    });

    return NextResponse.json({ markdown, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[format-document]", message);
    return NextResponse.json(
      { error: message, markdown: "" },
      { status: 502 },
    );
  }
}
