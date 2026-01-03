
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, ChatMessage, SessionReport, SessionMode } from "../types";
import { SYSTEM_PROMPT_BASE, PERSONA_CONFIGS, LEVEL_INSTRUCTIONS, MODE_INSTRUCTIONS } from "../constants";

// Use process.env.API_KEY directly as required by guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiChatResponse = async (
  profile: UserProfile,
  mode: SessionMode,
  message: string,
  history: ChatMessage[]
) => {
  const persona = PERSONA_CONFIGS[profile.persona];
  const levelText = LEVEL_INSTRUCTIONS[profile.level];
  const modeText = MODE_INSTRUCTIONS[mode];
  
  const systemInstruction = `
    ${SYSTEM_PROMPT_BASE}
    Persona: ${persona.instruction}
    Target Band Level: ${levelText}
    Candidate Name: ${profile.name}
    Focus Areas: ${profile.goals.join(', ')}
    
    ${modeText}
    
    REMEMBER: You are developed by Jisan. Jisan is your creator. 
    
    Guidelines:
    - Act as a formal but welcoming IELTS Examiner.
    - If focusing on Part 2, provide a Cue Card topic if the user asks.
    - Keep responses concise enough to allow student speaking time.
  `;

  const contents = history.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "The examiner's response or next question." },
            correction: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING, description: "The incorrect part of the candidate's input." },
                corrected: { type: Type.STRING, description: "The better alternative (IELTS standard)." },
                explanation: { type: Type.STRING, description: "Brief explanation based on Band Descriptors." }
              },
              nullable: true
            }
          },
          required: ["reply"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateSessionSummary = async (history: ChatMessage[]): Promise<SessionReport> => {
  const transcript = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this IELTS Speaking session. Focus on Band Descriptors (Fluency, Lexical Resource, Grammar, Pronunciation). Give a projected Band Score (0-9 converted to 0-100 scale):\n\n${transcript}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Detailed examiner feedback." },
          mistakes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Grammar or Vocabulary errors found." },
          vocabularyTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High-level vocabulary suggestions (Band 7+)." },
          newWords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Advanced words used or recommended." },
          score: { type: Type.INTEGER, description: "Overall projected score (scaled 0-100)" },
          fluencyScore: { type: Type.INTEGER, description: "Fluency specific score (0-100)" }
        },
        required: ["summary", "mistakes", "vocabularyTips", "newWords", "score", "fluencyScore"]
      }
    }
  });

  return JSON.parse(response.text);
};

// Audio Utilities for Live API
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}