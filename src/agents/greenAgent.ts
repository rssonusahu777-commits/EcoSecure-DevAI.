import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Green Optimization Agent
 * 
 * Monitors cloud infrastructure metrics to reduce carbon footprint.
 */
export async function runGreenOptimizationAgent(cloudMetrics: string) {
  const prompt = `
You are a Green Computing Optimization AI.
Analyze the following cloud infrastructure and CI/CD pipeline metrics:
---
${cloudMetrics}
---

Detect:
- Unnecessary builds or redundant CI jobs
- Idle servers or over-provisioned clusters
- Compute waste

Suggest specific, actionable optimizations to reduce energy consumption, cloud cost, and the overall carbon footprint.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Green Agent Error:", error);
    throw new Error("Failed to generate green optimization report.");
  }
}
