import Anthropic from "@anthropic-ai/sdk";
import type { PersonaOutput } from "./types";

const MAX_RETRIES = 2;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callPersona(
  systemInstruction: string,
  contractText: string,
  language: string = "Japanese",
  personaData?: { label: string; legalRef: string; legalSummary: string }
): Promise<PersonaOutput> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const finalInstruction = `${systemInstruction}\n\n【最重要事項】
以下のJSONフィールドの出力は「必ず」指定言語（${language}）に翻訳してください。日本語のまま出力してはいけません。
- issue
- suggestion
- translatedLabel（元の「${personaData?.label}」を翻訳）
- translatedLegalRef（元の「${personaData?.legalRef}」を翻訳）
- translatedLegalSummary（元の「${personaData?.legalSummary}」を翻訳）`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        temperature: 0.1,
        system: finalInstruction,
        messages: [
          {
            role: "user",
            content: `以下の契約書テキストをチェックし、結果（issueとsuggestion）を必ず ${language} で出力してください:\n\n${contractText}`,
          },
        ],
        tools: [
          {
            name: "output_compliance_check",
            description: "Outputs the result of the compliance check.",
            input_schema: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["PASS", "WARN", "FAIL"] },
                issue: { type: "string" },
                suggestion: { type: "string" },
                translatedLabel: { type: "string" },
                translatedLegalRef: { type: "string" },
                translatedLegalSummary: { type: "string" },
              },
              required: [
                "status",
                "issue",
                "suggestion",
                "translatedLabel",
                "translatedLegalRef",
                "translatedLegalSummary",
              ],
            },
          },
        ],
        tool_choice: { type: "tool", name: "output_compliance_check" },
      });

      // Anthropic tool_calls return the input arguments as an object.
      // We look for the tool_use block.
      const toolCall = response.content.find(
        (block) => block.type === "tool_use" && block.name === "output_compliance_check"
      );

      if (!toolCall || toolCall.type !== "tool_use") {
        throw new Error("Tool call failed or was not returned.");
      }

      return toolCall.input as unknown as PersonaOutput;
    } catch (err: any) {
      const isRateLimit = err?.status === 429;
      if (isRateLimit && attempt < MAX_RETRIES) {
        await wait(2000 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }

  throw new Error("リトライ回数を超過しました");
}
