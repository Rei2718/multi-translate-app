"use client";

interface Props {
  contractText: string;
  onTextChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  onCheck: () => void;
  loading: boolean;
}

const UI_DICT: Record<string, any> = {
  Japanese: {
    label: "契約書テキスト（日本語）",
    outputLabel: "解説の言語:",
    placeholder: "ここに労働契約書や労働条件通知書の本文を貼り付けてください。スマートフォンで写真を撮ってテキストを抽出したものでも構いません。",
    button: "AI でチェックする",
    checking: "分析中...",
  },
  English: {
    label: "Contract Text (Japanese)",
    outputLabel: "Explanation Language:",
    placeholder: "Paste the text of your labor contract or working conditions notice here. You can also extract text from a photo.",
    button: "Check with AI",
    checking: "Analyzing...",
  },
  "Chinese (Simplified)": {
    label: "合同文本（日语）",
    outputLabel: "解释语言：",
    placeholder: "在此粘贴劳动合同或劳动条件通知书的文本。您也可以粘贴从照片中提取的文本。",
    button: "使用 AI 检查",
    checking: "分析中...",
  },
  Korean: {
    label: "계약서 텍스트 (일본어)",
    outputLabel: "설명 언어:",
    placeholder: "여기에 근로 계약서 또는 근로 조건 통지서의 텍스트를 붙여넣으세요. 사진에서 추출한 텍스트도 가능합니다.",
    button: "AI로 확인하기",
    checking: "분석 중...",
  },
  Vietnamese: {
    label: "Văn bản hợp đồng (Tiếng Nhật)",
    outputLabel: "Ngôn ngữ giải thích:",
    placeholder: "Dán văn bản hợp đồng lao động hoặc thông báo điều kiện làm việc vào đây. Bạn cũng có thể dán văn bản trích xuất từ ảnh.",
    button: "Kiểm tra bằng AI",
    checking: "Đang phân tích...",
  },
};

export default function CheckForm({
  contractText,
  onTextChange,
  language,
  onLanguageChange,
  onCheck,
  loading,
}: Props) {
  const t = UI_DICT[language] || UI_DICT.Japanese;

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/20 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {t.label}
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {t.outputLabel}
            </label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="Japanese">日本語</option>
              <option value="English">English</option>
              <option value="Chinese (Simplified)">中文 (简体)</option>
              <option value="Korean">한국어</option>
              <option value="Vietnamese">Tiếng Việt</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <textarea
          value={contractText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={t.placeholder}
          rows={10}
          className="w-full resize-y rounded-xl border border-zinc-300 bg-zinc-50/50 p-4 text-sm leading-relaxed text-zinc-900 shadow-inner outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-800 transition-colors"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">
            {contractText.length > 0 &&
              `${contractText.length.toLocaleString()} chars`}
          </span>
          <button
            type="button"
            onClick={onCheck}
            disabled={loading || !contractText.trim()}
            className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none dark:disabled:bg-zinc-700 dark:focus:ring-offset-zinc-900"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t.checking}
              </>
            ) : (
              <>
                <span className="relative z-10">{t.button}</span>
                <span className="relative z-10 text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">✨</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
