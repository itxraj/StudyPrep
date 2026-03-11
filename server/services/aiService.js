import { GoogleGenAI, Type } from '@google/genai';

const aiConfig = {
    apiKey: process.env.GEMINI_API_KEY,
};

export const generateQuizService = async (text, numQuestions = 10) => {
    const ai = new GoogleGenAI(aiConfig);
    const prompt = `Based STRICTLY AND ONLY on the following study material, generate EXACTLY ${numQuestions} multiple choice questions. Do not use outside general knowledge. If the material is too short, generate as many as possible.
The response must be a valid JSON array of objects, where each object has the keys:
- "question" (string)
- "options" (array of 4 strings)
- "correctAnswer" (string, must exactly match one of the options)
- "explanation" (string)

Study Material:
${text}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                }
            }
        }
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse;
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        throw new Error("AI generated invalid JSON");
    }
};

export const generateFlashcardsService = async (text, numCards = 5) => {
    const ai = new GoogleGenAI(aiConfig);
    const prompt = `Based STRICTLY AND ONLY on the following study material, generate EXACTLY ${numCards} flashcards for key concepts. Do not use outside knowledge.
The response must be a valid JSON array of objects, where each object has the keys:
- "front" (string, the concept or short question)
- "back" (string, the definition or explanation from the text)

Study Material:
${text}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        front: { type: Type.STRING },
                        back: { type: Type.STRING }
                    },
                    required: ["front", "back"]
                }
            }
        }
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse;
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        throw new Error("AI generated invalid JSON");
    }
};
