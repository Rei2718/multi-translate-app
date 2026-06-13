"use client";

import { useState } from "react";

import DocumentInput from "@/components/DocumentInput";
import PromptPanel from "@/components/PromptPanel";
import TranslationView from "@/components/TranslationView";
import {
  DOC_TYPES,
  TARGET_LANGUAGES,
  getDocTypeLabel,
  getLangLabel,
} from "@/lib/constants";
import { buildRetranslationPrompt } from "@/lib/prompt";
import type {
  TargetLangCode,
  TranslateResponse,
} from "@/lib/types";

interface TranslationResult {
  translatedText: string;
  mock: boolean;
}

export default function TranslatorApp() {
  const [originalText, setOriginalText] = useState("");
  const [docType, setDocType] = useState(DOC_TYPES[0].id);
  const [targetLang, setTargetLang] = useState<TargetLangCode>(
    TARGET_LANGUAGES[0].code
  );

  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string | null>(null);

  async function handleTranslate() {
    if (!originalText.trim()) {
      setError("翻訳する文章を入力してください");
      return;
    }
    setLoading(true);
    setError(null);
    setPrompt(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, targetLang }),
      });
      const data = (await res.json()) as TranslateResponse;

      if (!res.ok || data.error) {
        setResult(null);
        setError(data.error ?? "翻訳に失敗しました");
        return;
      }
      setResult({ translatedText: data.translatedText, mock: data.mock });
    } catch {
      setResult(null);
      setError("通信エラーが発生しました。時間をおいて再度お試しください");
    } finally {
      setLoading(false);
    }
  }

  function handleGeneratePrompt() {
    if (!result) return;
    const generated = buildRetranslationPrompt({
      docTypeLabel: getDocTypeLabel(docType),
      targetLangLabel: getLangLabel(targetLang),
      original: originalText,
      deeplDraft: result.translatedText,
    });
    setPrompt(generated);
  }

  return (
    <div className="flex flex-col gap-8">
      <DocumentInput
        originalText={originalText}
        onTextChange={setOriginalText}
        docType={docType}
        onDocTypeChange={setDocType}
        targetLang={targetLang}
        onTargetLangChange={setTargetLang}
        onTranslate={handleTranslate}
        loading={loading}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {result && (
        <TranslationView
          original={originalText}
          translated={result.translatedText}
          targetLangLabel={getLangLabel(targetLang)}
          mock={result.mock}
          onGeneratePrompt={handleGeneratePrompt}
          promptGenerated={prompt !== null}
        />
      )}

      {prompt && <PromptPanel prompt={prompt} />}
    </div>
  );
}
