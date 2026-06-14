"use client";

import { useState } from "react";
import CheckForm from "@/components/check/check-form";
import AiComplianceResult from "@/components/check/ai-compliance-result";
import { useComplianceCheck } from "@/lib/check/use-compliance-check";

export default function CheckPage() {
  const [contractText, setContractText] = useState("");
  const [language, setLanguage] = useState("Japanese");
  const { result, loading, error, execute } = useComplianceCheck();

  return (
    <div className="flex flex-col gap-8">
      <CheckForm
        contractText={contractText}
        onTextChange={setContractText}
        language={language}
        onLanguageChange={setLanguage}
        onCheck={() => execute(contractText, language)}
        loading={loading}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {result && (
        <AiComplianceResult
          results={result.results}
          isCompliant={result.isCompliant}
          mock={result.mock}
          language={language}
        />
      )}
    </div>
  );
}
