import { GoogleGenAI } from "@google/genai";
import { UserProfile, CareerRecommendation, careerSchema } from "../types";

export async function getCareerRecommendations(profile: UserProfile): Promise<CareerRecommendation[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `
    As an expert career counselor, analyze the following user profile and recommend the top 5 most suitable career paths.
    
    User Profile:
    - Skills: ${profile.skills.join(", ")}
    - Interests: ${profile.interests.join(", ")}
    - Education: ${profile.education}
    - Experience Level: ${profile.experienceLevel}
    - Work Preference: ${profile.workPreference}
    - Core Values: ${profile.values.join(", ")}
    
    Provide detailed, realistic, and inspiring recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: careerSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as CareerRecommendation[];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
}
