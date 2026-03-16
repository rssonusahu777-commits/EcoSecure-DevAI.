import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * AI Code Review Agent
 * 
 * Analyzes Git diffs from Merge Requests.
 * Detects inefficient logic, bad practices, and performance issues.
 */
export async function runCodeReviewAgent(gitDiff: string) {
  const prompt = `
You are an expert AI Code Reviewer.
Review the following Git diff for a Merge Request:
---
${gitDiff}
---

Focus your review on:
- Inefficient logic
- Bad coding practices
- Performance issues
- Maintainability problems

Provide your review as actionable, constructive comments that can be posted directly to a GitLab Merge Request.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Review Agent Error:", error);
    throw new Error("Failed to generate code review.");
  }
}
