import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
// Note: process.env.GEMINI_API_KEY is automatically injected by the AI Studio environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Security Fix Agent
 * 
 * Integrates with output from Bandit, Semgrep, or Snyk.
 * Analyzes the vulnerability and generates a secure code fix.
 */
export async function runSecurityFixAgent(codeSnippet: string, scanToolOutput: string) {
  const prompt = `
You are an expert Security DevOps AI.
A static analysis tool (e.g., Semgrep, Snyk, Bandit) found the following vulnerability:
---
${scanToolOutput}
---

Here is the vulnerable code snippet:
---
${codeSnippet}
---

Please provide:
1. A brief explanation of the vulnerability.
2. The secure, fixed code.
3. An explanation of why the fix resolves the issue.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Security Agent Error:", error);
    throw new Error("Failed to generate security fix.");
  }
}
