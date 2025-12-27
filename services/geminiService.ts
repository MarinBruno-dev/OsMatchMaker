
import { GoogleGenAI, Type } from "@google/genai";
import { SystemSpecs, ComparisonResult } from "../types";

export const getOsRecommendations = async (specs: SystemSpecs): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const experienceDescription = {
    beginner: "New to tech, wants everything to 'just work' with a friendly interface.",
    intermediate: "Comfortable with settings, maybe used a terminal once or twice, likes customization.",
    pro: "Power user, loves the terminal, wants maximum control, and might enjoy DIY distros like Arch or NixOS."
  }[specs.userExperience || 'beginner'];

  const prompt = `
    Analyze this computer system and recommend the best operating system (Windows, macOS, or various Linux distros) 
    based on the following hardware specifications and user profile. 

    System Specs:
    - Current OS: ${specs.os}
    - Platform: ${specs.platform}
    - CPU Cores: ${specs.cores}
    - RAM (GB): ${specs.memory || '8 (Estimated)'}
    - Device Type: ${specs.isLaptop ? 'Laptop' : 'Desktop'}
    - Current Battery Level: ${specs.batteryLevel ? Math.round(specs.batteryLevel * 100) + '%' : 'N/A'}

    User Profile:
    - Age: ${specs.userAge || 'Not specified'}
    - Tech Experience: ${specs.userExperience} (${experienceDescription})

    CRITICAL RULES:
    1. If the user is 'pro', include advanced options like Arch Linux, Alpine, or NixOS if suitable for the hardware.
    2. If the user is 'beginner', prioritize user-friendly distros like Linux Mint, Zorin OS, Ubuntu, or staying with their current OS if it's optimal.
    3. Provide a valid 'downloadUrl' for the official download or home page of the OS.
    4. If you recommend 'Zorin OS Lite', you MUST use this exact download link: https://help.zorin.com/docs/getting-started/getting-zorin-os-lite/
    5. The tone should be friendly, enthusiastic, and fun—like a matchmaker.
    6. The first recommendation MUST be the absolute 'Top Pick'.
    
    For each OS:
    1. 'description': A friendly summary of the OS's personality.
    2. 'recommendationReason': A persuasive and fun explanation of why THIS user specifically will LOVE this choice given their age and experience.
    3. 'downloadUrl': The official URL to download the OS.
    
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          currentOsAnalysis: { type: Type.STRING },
          hardwareSummary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                osName: { type: Type.STRING },
                overallScore: { type: Type.NUMBER },
                performanceScore: { type: Type.NUMBER },
                batteryScore: { type: Type.NUMBER },
                description: { type: Type.STRING },
                recommendationReason: { type: Type.STRING },
                downloadUrl: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                isTopPick: { type: Type.BOOLEAN }
              },
              required: ["osName", "overallScore", "performanceScore", "batteryScore", "description", "recommendationReason", "downloadUrl", "pros", "cons"]
            }
          }
        },
        required: ["currentOsAnalysis", "hardwareSummary", "recommendations"]
      }
    }
  });

  const result = JSON.parse(response.text);
  if (result.recommendations && result.recommendations.length > 0) {
    result.recommendations[0].isTopPick = true;
  }
  return result;
};
