import TranslatorApp from "@/components/TranslatorApp";
import Link from "next/link";

const FLOW_STEPS = [
  "文書を入力（貼り付け / .txt / PDF）",
  "文書の種類・翻訳先の言語を選ぶ",
  "DeepLで翻訳し、原文と並べて確認",
  "不自然なら再翻訳プロンプトを生成・コピー",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              多言語労働文書翻訳アプリ
            </p>
            <Link
              href="/check"
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
            >
              ✨ AIコンプラチェックはこちら &rarr;
            </Link>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            労働文書を、母国語で正しく理解する
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            労働契約書や職場マニュアルを DeepL
            で自動翻訳。訳が不自然なときは、ご自身の Claude / ChatGPT
            で再翻訳するための最適なプロンプトを生成します。
          </p>
          <ol className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {FLOW_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-6">
        <TranslatorApp />
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-6"></div>
      </footer>
    </div>
  );
}
