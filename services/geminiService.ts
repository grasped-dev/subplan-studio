import { GoogleGenAI, Type } from '@google/genai';
import { PROMPT_TEMPLATES } from '../constants';
import type { LessonPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// In a real app, this would make a call to the Gemini API
export const generateLessonPlan = async (
    grade: string,
    standards: string[],
    priorLearning: string,
    focus: string
): Promise<LessonPlan> => {
    const prompt = PROMPT_TEMPLATES.LESSON_PLAN
        .replace('{grade}', grade)
        .replace('{standards}', standards.join(', '))
        .replace('{priorLearning}', priorLearning)
        .replace('{focus}', focus);

    console.log("Generating lesson plan for:", { grade, standards, priorLearning, focus });
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        objective: { type: Type.STRING },
                        materials: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        procedure: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        checks: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        closure: { type: Type.STRING },
                    },
                    required: ['objective', 'materials', 'procedure', 'checks', 'closure']
                }
            }
        });
        
        const lessonPlan = JSON.parse(response.text);
        return lessonPlan as LessonPlan;
    } catch (error) {
        console.error("Error generating lesson plan:", error);
        throw new Error("Failed to generate lesson plan from AI.");
    }
};

export const generateScript = async (planText: string): Promise<string> => {
    const prompt = PROMPT_TEMPLATES.SCRIPT.replace('{planText}', planText);
    console.log("Generating script...");

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating script:", error);
        throw new Error("Failed to generate script from AI.");
    }
};


export const generateImagePrompts = async (script: string): Promise<string[]> => {
    const fullPrompt = `${PROMPT_TEMPLATES.IMAGE_PROMPTS}\n\nSCRIPT:\n${script}`;
    console.log("Generating image prompts...");
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
    
        const prompts = JSON.parse(response.text);
        return prompts as string[];
    } catch (error) {
        console.error("Error generating image prompts:", error);
        throw new Error("Failed to generate image prompts from AI.");
    }
};

export const generateSubstituteNote = async(planText: string): Promise<string> => {
     const prompt = PROMPT_TEMPLATES.SUBSTITUTE_NOTE.replace('{planText}', planText);
     console.log("Generating substitute note...");
     
     try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
     } catch (error) {
         console.error("Error generating substitute note:", error);
         throw new Error("Failed to generate substitute note from AI.");
     }
}