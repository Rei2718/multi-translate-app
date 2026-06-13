"use client";

import { useCallback, useState } from "react";

interface PdfDownloadParams {
  translatedText: string;
  targetLangLabel: string;
  docTypeLabel: string;
}

export type PdfDownloadState = "idle" | "formatting" | "generating" | "done" | "error";

export function usePdfDownload() {
  const [state, setState] = useState<PdfDownloadState>("idle");

  const download = useCallback(
    async ({ translatedText, targetLangLabel, docTypeLabel }: PdfDownloadParams) => {
      setState("formatting");

      try {
        const res = await fetch("/api/format-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ translatedText, targetLangLabel, docTypeLabel }),
        });

        const data = (await res.json()) as { markdown: string; error: string | null };
        if (!res.ok || data.error) throw new Error(data.error ?? "API error");

        setState("generating");

        const [{ default: jsPDF }, html2canvas, { marked }] = await Promise.all([
          import("jspdf"),
          import("html2canvas-pro").then((m) => m.default),
          import("marked"),
        ]);

        const html = await marked(data.markdown);

        const wrapper = document.createElement("div");
        wrapper.style.cssText = [
          "position:fixed",
          "top:-9999px",
          "left:0",
          "width:800px",
          "padding:48px",
          "background:#fff",
          "color:#1a1a1a",
          "font-family:sans-serif",
          "font-size:14px",
          "line-height:1.8",
        ].join(";");

        const style = document.createElement("style");
        style.textContent = `
          h1 { font-size:22px; font-weight:700; margin:0 0 12px; color:#111; border-bottom:2px solid #4f46e5; padding-bottom:8px; }
          h2 { font-size:18px; font-weight:600; margin:24px 0 8px; color:#1e293b; }
          h3 { font-size:15px; font-weight:600; margin:16px 0 6px; color:#334155; }
          p { margin:0 0 10px; }
          ul, ol { margin:0 0 12px; padding-left:24px; }
          li { margin:0 0 4px; }
          table { border-collapse:collapse; width:100%; margin:12px 0; }
          th, td { border:1px solid #d1d5db; padding:8px 12px; text-align:left; font-size:13px; }
          th { background:#f1f5f9; font-weight:600; }
          hr { border:none; border-top:1px solid #e2e8f0; margin:20px 0; }
          strong { font-weight:600; }
        `;

        wrapper.appendChild(style);

        const content = document.createElement("div");
        content.innerHTML = html;
        wrapper.appendChild(content);

        document.body.appendChild(wrapper);

        const canvas = await html2canvas(wrapper, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        document.body.removeChild(wrapper);

        const imgWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const contentWidth = imgWidth - margin * 2;
        const contentHeight = (canvas.height * contentWidth) / canvas.width;

        const pdf = new jsPDF("p", "mm", "a4");
        const maxContentHeight = pageHeight - margin * 2;
        let yOffset = 0;

        while (yOffset < contentHeight) {
          if (yOffset > 0) pdf.addPage();

          const sourceY = (yOffset / contentHeight) * canvas.height;
          const sourceH = (maxContentHeight / contentHeight) * canvas.height;

          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(sourceH, canvas.height - sourceY);

          const ctx = pageCanvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context unavailable");

          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height,
          );

          const pageImg = pageCanvas.toDataURL("image/png");
          const drawHeight = (pageCanvas.height * contentWidth) / canvas.width;

          pdf.addImage(pageImg, "PNG", margin, margin, contentWidth, drawHeight);

          yOffset += maxContentHeight;
        }

        const stamp = new Date().toISOString().slice(0, 10);
        pdf.save(`translation_${stamp}.pdf`);
        setState("done");
        setTimeout(() => setState("idle"), 2000);
      } catch {
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    },
    [],
  );

  return { state, download } as const;
}
