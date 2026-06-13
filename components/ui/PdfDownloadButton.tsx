"use client";

import type { PdfDownloadState } from "@/lib/use-pdf-download";

const LABEL_MAP: Record<PdfDownloadState, string> = {
  idle: "翻訳結果をPDFでダウンロード",
  formatting: "AIが文書を整形中…",
  generating: "PDF生成中…",
  done: "ダウンロードしました ✓",
  error: "生成に失敗しました",
};

interface Props {
  state: PdfDownloadState;
  onClick: () => void;
}

export default function PdfDownloadButton({ state, onClick }: Props) {
  const busy = state === "formatting" || state === "generating";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
    >
      <DownloadIcon />
      {LABEL_MAP[state]}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
