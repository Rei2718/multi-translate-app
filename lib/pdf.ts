// クライアント側で PDF からテキストを抽出する。
// サーバーへファイルを送らないため、文書をサーバーに保存しない方針を守れる。

/**
 * PDF ファイルから全ページのテキストを抽出して連結する。
 * pdfjs-dist は重いのでブラウザでの動的 import にする。
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  // 動的 import（クライアント実行時のみ読み込む）
  const pdfjs = await import("pdfjs-dist");

  // Worker の場所を解決する。Turbopack / バンドラの import.meta.url 解決を利用。
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pageTexts: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items
      // TextItem のみ（TextMarkedContent には str がない）
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pageTexts.push(text);
  }

  return pageTexts.join("\n\n").trim();
}
