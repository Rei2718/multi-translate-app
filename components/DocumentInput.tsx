"use client";

import { useRef, useState } from "react";

import SampleContractModal from "@/components/SampleContractModal";
import { DOC_TYPES, TARGET_LANGUAGES } from "@/lib/constants";
import { extractTextFromPdf } from "@/lib/pdf";
import type { TargetLangCode } from "@/lib/types";

interface Props {
  originalText: string;
  onTextChange: (value: string) => void;
  docType: string;
  onDocTypeChange: (value: string) => void;
  targetLang: TargetLangCode;
  onTargetLangChange: (value: TargetLangCode) => void;
  onTranslate: () => void;
  loading: boolean;
  onCheckCompliance: () => void;
}

export default function DocumentInput({
  originalText,
  onTextChange,
  docType,
  onDocTypeChange,
  targetLang,
  onTargetLangChange,
  onTranslate,
  loading,
  onCheckCompliance,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);

  async function handleFile(file: File) {
    setFileError(null);
    setFileName(file.name);
    setFileLoading(true);
    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        text = await extractTextFromPdf(file);
      } else {
        // .txt などのプレーンテキスト
        text = await file.text();
      }
      if (!text.trim()) {
        setFileError("ファイルから文字を読み取れませんでした");
        return;
      }
      onTextChange(text);
    } catch {
      setFileError("ファイルの読み込みに失敗しました");
    } finally {
      setFileLoading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    // 同じファイルを連続で選べるようにリセット
    e.target.value = "";
  }

  return (
    <>
      {showSample && (
        <SampleContractModal
          onLoad={(text) => { onTextChange(text); setFileName(null); }}
          onClose={() => setShowSample(false)}
        />
      )}
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            文書の種類
          </span>
          <select
            value={docType}
            onChange={(e) => onDocTypeChange(e.target.value)}
            className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {DOC_TYPES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            翻訳先の言語
          </span>
          <select
            value={targetLang}
            onChange={(e) =>
              onTargetLangChange(e.target.value as TargetLangCode)
            }
            className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {TARGET_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}（{l.nativeName}）
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          日本語の原文
        </label>
        <button
          type="button"
          onClick={() => setShowSample(true)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M3 4h6M3 6h6M3 8h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          サンプル文書を見る
        </button>
      </div>
      <textarea
        value={originalText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="ここに労働契約書やマニュアルの本文を貼り付けてください。"
        rows={10}
        className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 text-sm leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,text/plain,application/pdf"
          onChange={onFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={fileLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {fileLoading ? "読み込み中…" : "ファイルを読み込む（.txt / PDF）"}
        </button>
        {fileName && !fileError && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {fileName}
          </span>
        )}
        {originalText && (
          <span className="ml-auto text-xs text-zinc-400">
            {originalText.length.toLocaleString()} 文字
          </span>
        )}
      </div>
      {fileError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {fileError}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onTranslate}
          disabled={loading || fileLoading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? "翻訳中…" : "DeepLで翻訳する"}
        </button>
        {originalText.trim() && (
          <button
            type="button"
            onClick={onCheckCompliance}
            disabled={fileLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 sm:w-auto"
          >
            労働法チェック
          </button>
        )}
      </div>
    </section>
    </>
  );
}
