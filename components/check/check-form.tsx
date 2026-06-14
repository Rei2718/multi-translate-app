"use client";

interface Props {
  contractText: string;
  onTextChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  onCheck: () => void;
  loading: boolean;
}

export default function CheckForm({
  contractText,
  onTextChange,
  language,
  onLanguageChange,
  onCheck,
  loading,
}: Props) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            契約書テキスト（日本語）
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">出力言語:</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="Japanese">日本語</option>
              <option value="English">English</option>
              <option value="Chinese (Simplified)">中文 (简体)</option>
              <option value="Korean">한국어</option>
              <option value="Vietnamese">Tiếng Việt</option>
            </select>
          </div>
        </div>
        <textarea
          value={contractText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="ここに労働契約書の本文を貼り付けてください。"
          rows={12}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 text-sm leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            {contractText.length > 0 &&
              `${contractText.length.toLocaleString()} 文字`}
          </span>
          <button
            type="button"
            onClick={onCheck}
            disabled={loading || !contractText.trim()}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:disabled:bg-zinc-600"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                チェック中…
              </>
            ) : (
              "AI コンプラチェック"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
