"use client";

interface Props {
  original: string;
  translated: string;
  targetLangLabel: string;
  mock: boolean;
  onGeneratePrompt: () => void;
  promptGenerated: boolean;
}

export default function TranslationView({
  original,
  translated,
  targetLangLabel,
  mock,
  onGeneratePrompt,
  promptGenerated,
}: Props) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          翻訳結果
        </h2>
        {mock && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            モック（DeepL未接続）
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Pane title="原文（日本語）" text={original} />
        <Pane title={`翻訳（${targetLangLabel}）`} text={translated} accent />
      </div>

      <div className="mt-5 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          翻訳が不自然・不正確だと感じたら、AI（Claude / ChatGPT）で再翻訳するための
          プロンプトを生成できます。
        </p>
        <button
          type="button"
          onClick={onGeneratePrompt}
          className="mt-3 inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          {promptGenerated ? "プロンプトを再生成" : "再翻訳プロンプトを生成"}
        </button>
      </div>
    </section>
  );
}

function Pane({
  title,
  text,
  accent = false,
}: {
  title: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h3>
      <div
        className={`min-h-40 flex-1 whitespace-pre-wrap rounded-lg border p-3 text-sm leading-relaxed ${
          accent
            ? "border-indigo-200 bg-indigo-50/40 text-zinc-900 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-zinc-100"
            : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
