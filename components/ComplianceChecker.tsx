"use client";

import type { ComplianceItem, ComplianceStatus } from "@/lib/compliance";

const STATUS_CONFIG: Record<
  ComplianceStatus,
  { icon: string; rowClass: string; badgeClass: string }
> = {
  ok: {
    icon: "✅",
    rowClass:
      "border-l-2 border-green-400 bg-green-50/50 dark:border-green-600 dark:bg-green-950/20",
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  warning: {
    icon: "⚠️",
    rowClass:
      "border-l-2 border-yellow-400 bg-yellow-50/50 dark:border-yellow-600 dark:bg-yellow-950/20",
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  error: {
    icon: "❌",
    rowClass:
      "border-l-2 border-red-400 bg-red-50/50 dark:border-red-600 dark:bg-red-950/20",
    badgeClass:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
};

interface Props {
  items: ComplianceItem[];
}

export default function ComplianceChecker({ items }: Props) {
  const okCount = items.filter((i) => i.status === "ok").length;
  const warnCount = items.filter((i) => i.status === "warning").length;
  const errorCount = items.filter((i) => i.status === "error").length;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* ヘッダー */}
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              労働法コンプライアンスチェック
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              日本の労働基準法に基づくキーワードマッチ診断
            </p>
          </div>
          {/* サマリーバッジ */}
          <div className="flex shrink-0 items-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800 dark:bg-green-900/40 dark:text-green-300">
              ✅ 適合 {okCount}
            </span>
            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
              ⚠️ 要確認 {warnCount}
            </span>
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-red-800 dark:bg-red-900/40 dark:text-red-300">
              ❌ 未記載 {errorCount}
            </span>
          </div>
        </div>
      </div>

      {/* チェック項目一覧 */}
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {items.map((item) => {
          const { icon, rowClass, badgeClass } = STATUS_CONFIG[item.status];
          return (
            <li key={item.id} className={`px-5 py-3.5 sm:px-6 ${rowClass}`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-sm leading-none">
                  {icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.label}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${badgeClass}`}
                    >
                      {item.legalRef}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {item.message}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {item.legalSummary}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* フッター注記 */}
      <div className="rounded-b-2xl border-t border-zinc-100 bg-zinc-50/60 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/30 sm:px-6">
        <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          ※ このチェックはキーワードマッチによる簡易診断です。記載がある場合でも内容が法定基準を満たさない場合があります。最終的な法的判断は社会保険労務士等の専門家にご相談ください。
        </p>
      </div>
    </section>
  );
}
