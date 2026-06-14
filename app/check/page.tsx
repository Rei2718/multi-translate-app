import type { Metadata } from "next";
import Link from "next/link";
import CheckPage from "@/components/check/check-page";

export const metadata: Metadata = {
  title: "AI コンプラチェック — 多言語労働文書翻訳アプリ",
  description:
    "労働契約書を AI が労働基準法の7項目に基づいて自動チェック。賃金・労働時間・休日・割増賃金・有給休暇・解雇予告・試用期間を並行分析。",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← トップへ戻る
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          AI コンプライアンスチェック
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          労働契約書を Claude が労働基準法の7項目に基づいて並行チェックします
        </p>
      </div>
      <CheckPage />
    </main>
  );
}
