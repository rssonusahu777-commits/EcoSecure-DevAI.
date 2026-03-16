import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Compliance Agent
 * 
 * Analyzes dependencies and infrastructure configs for compliance.
 */
export async function runComplianceAgent(dependencies: string, infraConfig: string) {
  const prompt = `
You are an AI Compliance Auditor.
Analyze the following project dependencies and infrastructure configuration:

Dependencies (e.g., package.json, requirements.txt):
---
${dependencies}
---

Infrastructure Config (e.g., Dockerfile, Terraform):
---
${infraConfig}
---

Check for:
- Data privacy compliance (GDPR, HIPAA readiness)
- Dependency licenses (e.g., identifying restrictive GPL licenses)
- Security policies (e.g., encryption at rest, secure headers)

Generate a structured compliance report summary.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Compliance Agent Error:", error);
    throw new Error("Failed to generate compliance report.");
  }
}
