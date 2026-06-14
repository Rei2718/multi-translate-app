"use client";

import { useCallback, useState } from "react";
import type { ComplianceCheckResponse } from "./types";

export function useComplianceCheck() {
  const [result, setResult] = useState<ComplianceCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (contractText: string, language: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, language }),
      });
      const data = (await res.json()) as ComplianceCheckResponse & {
        error?: string;
      };

      if (!res.ok || data.error) {
        setError(data.error ?? "チェックに失敗しました");
        return;
      }
      setResult(data);
    } catch {
      setError("通信エラーが発生しました。時間をおいて再度お試しください");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, execute, reset } as const;
}
