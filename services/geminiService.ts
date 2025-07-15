import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { QAResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const qaSchema = {
    type: Type.OBJECT,
    properties: {
        shortAnswerQuestions: {
            type: Type.ARRAY,
            description: "A list of 5 short-answer questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The short answer question text."
                    },
                },
                required: ['question']
            }
        },
        multipleChoiceQuestions: {
            type: Type.ARRAY,
            description: "A list of 5 multiple-choice questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The multiple choice question text."
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: {
                            type: Type.STRING
                        }
                    },
                    correctAnswer: {
                        type: Type.STRING,
                        description: "The correct answer, which must be one of the provided options."
                    }
                },
                required: ['question', 'options', 'correctAnswer']
            }
        }
    },
    required: ['shortAnswerQuestions', 'multipleChoiceQuestions']
};

export const generateQA = async (topic: string): Promise<QAResponse> => {
    const prompt = `You are an expert academic assistant. For the topic '${topic}', generate a JSON object containing two keys: 'shortAnswerQuestions' and 'multipleChoiceQuestions'. 'shortAnswerQuestions' should be an array of 5 objects, each with a 'question' string. 'multipleChoiceQuestions' should be an array of 5 objects, each with a 'question' string, an 'options' array of 4 strings, and a 'correctAnswer' string which must be one of the provided options. Ensure the questions are suitable for college-level students.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: qaSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as QAResponse;
    } catch (error) {
        console.error("Error generating Q&A:", error);
        throw new Error("Failed to generate questions and answers from the API.");
    }
};

export const generateNotes = async (topic: string): Promise<string> => {
    const prompt = `You are an expert lecturer. Create structured and comprehensive lecture notes on the topic: '${topic}'. The notes should be well-organized with clear headings, subheadings, bullet points, and detailed explanations. Use Markdown for formatting. Include a brief introduction, key concepts, detailed explanations for each, and a summary at the end.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating notes:", error);
        throw new Error("Failed to generate lecture notes from the API.");
    }
};

export const explainConcept = async (topic: string, language: string): Promise<string> => {
    const prompt = `You are a friendly and knowledgeable teacher. Explain the concept of '${topic}' in simple, easy-to-understand terms, as if you were explaining it to a student for the first time. The explanation should be concise and clear. Please provide the explanation in ${language}.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error explaining concept:", error);
        throw new Error("Failed to generate explanation from the API.");
    }
};

const dataUrlToBase64 = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
}

export const explainDiagram = async (imageDataUrl: string, prompt: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/png',
            data: dataUrlToBase64(imageDataUrl),
        },
    };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error explaining diagram:", error);
        throw new Error("Failed to generate explanation for the diagram from the API.");
    }
};
