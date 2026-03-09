import { Type } from "@google/genai";

export interface CareerRecommendation {
  title: string;
  description: string;
  matchScore: number;
  keySkills: string[];
  educationPath: string;
  salaryRange: string;
  growthProspects: string;
  whyItMatches: string;
}

export interface UserProfile {
  skills: string[];
  interests: string[];
  education: string;
  experienceLevel: string;
  workPreference: string; // Remote, Hybrid, On-site
  values: string[];
}

export const careerSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "The job title" },
      description: { type: Type.STRING, description: "Brief overview of the role" },
      matchScore: { type: Type.NUMBER, description: "Percentage match (0-100)" },
      keySkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 5 required skills" },
      educationPath: { type: Type.STRING, description: "Recommended education or certifications" },
      salaryRange: { type: Type.STRING, description: "Estimated annual salary range" },
      growthProspects: { type: Type.STRING, description: "Future outlook for this career" },
      whyItMatches: { type: Type.STRING, description: "Explanation of why this fits the user's profile" },
    },
    required: ["title", "description", "matchScore", "keySkills", "educationPath", "salaryRange", "growthProspects", "whyItMatches"],
  },
};
