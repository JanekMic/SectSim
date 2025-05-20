
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// IMPORTANT: The API key MUST be set in the environment variable `process.env.API_KEY`.
// This service assumes `process.env.API_KEY` is available in the execution environment.
// For a frontend application, this would typically be managed by a build process (e.g., Vite, Webpack)
// or a backend proxy. For this standalone prototype, direct access to process.env in browser is not standard.
// This code is provided as per the prompt's requirement to include Gemini API usage structure.

export class GeminiService {
  private ai: GoogleGenAI;
  private modelName = 'gemini-2.5-flash-preview-04-17'; // General Text Tasks

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY for Gemini Service is not set in process.env.API_KEY. The service will not function.");
      // In a real app, you might throw an error or handle this more gracefully
      // For this prototype, we allow it to proceed but calls will fail.
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || "NO_API_KEY_PROVIDED" });
  }

  public async generateText(prompt: string): Promise<string> {
    if (!process.env.API_KEY) {
        return Promise.reject("Gemini API key not configured. Cannot generate text.");
    }
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });
      // Correctly access the text from the response
      return response.text;
    } catch (error) {
      console.error("Error generating content from Gemini:", error);
      // Handle API errors (e.g., 4xx/5xx).
      // Implement retry logic (exponential backoff) if appropriate for the use case.
      // For this example, we'll just re-throw or return a generic error message.
      if (error instanceof Error) {
        return Promise.reject(`Gemini API Error: ${error.message}`);
      }
      return Promise.reject("An unknown error occurred with the Gemini API.");
    }
  }

  // Example of generating text with system instruction
  public async generateTextWithSystemInstruction(prompt: string, systemInstruction: string): Promise<string> {
     if (!process.env.API_KEY) {
        return Promise.reject("Gemini API key not configured.");
    }
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          // thinkingConfig: { thinkingBudget: 0 } // Example: Disable thinking for low latency if needed
        }
      });
      return response.text;
    } catch (error) {
      console.error("Error generating content with system instruction:", error);
      if (error instanceof Error) {
        return Promise.reject(`Gemini API Error: ${error.message}`);
      }
      return Promise.reject("An unknown error occurred.");
    }
  }
  
  // Example of generating JSON (note: parsing logic is required)
  public async generateJsonData<T,>(prompt: string): Promise<T> {
    if (!process.env.API_KEY) {
        return Promise.reject("Gemini API key not configured.");
    }
    try {
        const response: GenerateContentResponse = await this.ai.models.generateContent({
            model: this.modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        return JSON.parse(jsonStr) as T;

    } catch (error) {
        console.error("Error generating JSON data from Gemini:", error);
         if (error instanceof Error) {
            return Promise.reject(`Gemini API Error (JSON): ${error.message}`);
        }
        return Promise.reject("An unknown error occurred while generating JSON.");
    }
  }
}
    