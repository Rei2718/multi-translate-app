"use client";

import type { CheckItemResult, PersonaStatus } from "@/lib/check/types";

const STATUS_CONFIG: Record<
  PersonaStatus,
  { icon: string; rowClass: string; badgeClass: string }
> = {
  PASS: {
    icon: "✅",
    rowClass:
      "border-l-2 border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-950",
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  WARN: {
    icon: "⚠️",
    rowClass:
      "border-l-2 border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-950",
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  FAIL: {
    icon: "❌",
    rowClass:
      "border-l-2 border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950",
    badgeClass:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

interface Props {
  results: CheckItemResult[];
  isCompliant: boolean;
  mock: boolean;
  language: string;
}

const UI_DICT: Record<string, any> = {
  Japanese: {
    title: "AI コンプライアンスチェック結果",
    mock: "モック（Claude未接続）",
    compliant: "法定必須事項は網羅されています",
    notCompliant: "法定必須事項に不備が見つかりました",
    pass: "適合",
    warn: "要確認",
    fail: "未記載",
    disclaimer: "※ このチェックは Claude による分析です。AI の判定は参考情報であり、法的助言ではありません。最終的な法的判断は社会保険労務士等の専門家にご相談ください。",
  },
  English: {
    title: "AI Compliance Check Results",
    mock: "Mock (Claude Disconnected)",
    compliant: "All mandatory legal requirements are covered",
    notCompliant: "Deficiencies found in mandatory legal requirements",
    pass: "PASS",
    warn: "WARN",
    fail: "FAIL",
    disclaimer: "* This check is an analysis by Claude. The AI's judgment is for reference only and does not constitute legal advice. Please consult a professional such as a Labor and Social Security Attorney for a final legal decision.",
  },
  "Chinese (Simplified)": {
    title: "AI 合规性检查结果",
    mock: "模拟（Claude未连接）",
    compliant: "已涵盖所有法定必备事项",
    notCompliant: "法定必备事项中发现不足",
    pass: "合格",
    warn: "需确认",
    fail: "未记载",
    disclaimer: "* 本检查由 Claude 分析得出。AI 的判断仅供参考，不构成法律建议。请咨询社会保险劳务士等专业人士以获取最终的法律意见。",
  },
  Korean: {
    title: "AI 컴플라이언스 체크 결과",
    mock: "모의 (Claude 미연결)",
    compliant: "법정 필수 사항이 모두 포함되어 있습니다",
    notCompliant: "법정 필수 사항에 미비점이 발견되었습니다",
    pass: "적합",
    warn: "확인 요망",
    fail: "미기재",
    disclaimer: "* 이 체크는 Claude에 의한 분석입니다. AI의 판단은 참고용이며 법적 조언이 아닙니다. 최종적인 법적 판단은 사회보험노무사 등 전문가와 상담하십시오.",
  },
  Vietnamese: {
    title: "Kết quả kiểm tra tuân thủ AI",
    mock: "Mô phỏng (Chưa kết nối Claude)",
    compliant: "Đã bao gồm đầy đủ các yêu cầu pháp lý bắt buộc",
    notCompliant: "Phát hiện thiếu sót trong các yêu cầu pháp lý bắt buộc",
    pass: "ĐẠT",
    warn: "LƯU Ý",
    fail: "CHƯA GHI",
    disclaimer: "* Kiểm tra này là phân tích của Claude. Đánh giá của AI chỉ mang tính tham khảo và không phải là lời khuyên pháp lý. Vui lòng tham khảo ý kiến chuyên gia như Luật sư Lao động và Bảo hiểm Xã hội để có quyết định pháp lý cuối cùng.",
  }
};

export default function AiComplianceResult({
  results,
  isCompliant,
  mock,
  language,
}: Props) {
  const passCount = results.filter((r) => r.status === "PASS").length;
  const warnCount = results.filter((r) => r.status === "WARN").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;

  const t = UI_DICT[language] || UI_DICT["Japanese"];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t.title}
              </h2>
              {mock && (
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  {t.mock}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {isCompliant ? t.compliant : t.notCompliant}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800 dark:bg-green-900 dark:text-green-300">
              ✅ {t.pass} {passCount}
            </span>
            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              ⚠️ {t.warn} {warnCount}
            </span>
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-red-800 dark:bg-red-900 dark:text-red-300">
              ❌ {t.fail} {failCount}
            </span>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {results.map((item) => {
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
                  {item.issue && (
                    <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
                      💬 {item.issue}
                    </p>
                  )}
                  {item.suggestion && (
                    <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                      💡 {item.suggestion}
                    </p>
                  )}
                  <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {item.legalSummary}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="rounded-b-2xl border-t border-zinc-100 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800 sm:px-6">
        <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          {t.disclaimer}
        </p>
      </div>
    </section>
  );
}
