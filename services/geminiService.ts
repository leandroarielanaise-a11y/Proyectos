
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    candidates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          surname: { type: Type.STRING },
          experienceYears: { type: Type.NUMBER },
          scores: {
            type: Type.OBJECT,
            properties: {
              knowledge: { type: Type.NUMBER, description: "Puntuación de 0 a 20" },
              skills: { type: Type.NUMBER, description: "Puntuación de 0 a 20" },
              seniority: { type: Type.NUMBER, description: "Puntuación de 0 a 20" },
              languages: { type: Type.NUMBER, description: "Puntuación de 0 a 20. Poner 0 si no se menciona información de idiomas." },
              others: { type: Type.NUMBER, description: "Puntuación de 0 a 20" },
              total: { type: Type.NUMBER, description: "Suma de todas las puntuaciones (máx 100)" }
            },
            required: ["knowledge", "skills", "seniority", "languages", "others", "total"]
          },
          summary: { type: Type.STRING, description: "Resumen breve del perfil profesional" },
          recommendationReason: { type: Type.STRING, description: "Justificación de por qué es apto o no." },
          uniqueAttributes: { type: Type.STRING, description: "Párrafo separado detallando conocimientos o habilidades únicas que este candidato tiene y los otros NO." },
          languagesDetail: { type: Type.STRING, description: "Detalle de qué idiomas habla específicamente (ej: 'Inglés C1, Alemán B2')." }
        },
        required: ["id", "name", "surname", "experienceYears", "scores", "summary", "recommendationReason", "languagesDetail"]
      }
    },
    bestCandidateId: { type: Type.STRING },
    overallRecommendation: { type: Type.STRING, description: "Recomendación final experta para el reclutador" }
  },
  required: ["candidates", "bestCandidateId", "overallRecommendation"]
};

export async function analyzeCVs(files: File[]): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const fileParts = await Promise.all(
    files.map(async (file) => {
      const base64Data = await fileToBase64(file);
      return {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      };
    })
  );

  const prompt = `
    Actúa como un Experto en Reclutamiento y RRHH. 
    Analiza los CVs adjuntos y realiza una evaluación comparativa exhaustiva.
    
    REGLAS CRÍTICAS DE NEGOCIO:
    1. IDIOMAS: Si un CV no contiene información explícita sobre idiomas, la puntuación en esa categoría DEBE ser 0.
    2. COMPARATIVA DE IDIOMAS: Si los candidatos hablan idiomas diferentes, informa específicamente cuáles son en el campo 'languagesDetail'.
    3. ATRIBUTOS ÚNICOS: Si un candidato posee un conocimiento, habilidad o certificación técnica que NINGUNO de los otros candidatos tiene, descríbelo detalladamente en un párrafo separado en el campo 'uniqueAttributes'.
    4. PUNTUACIONES: Cada categoría es de 0 a 20. El total es la suma (máx 100).
    
    Devuelve los datos estrictamente en el formato JSON solicitado y TODO EN ESPAÑOL.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        ...fileParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.1
    }
  });

  const text = response.text;
  if (!text) throw new Error("Respuesta vacía de la IA");
  
  return JSON.parse(text) as AnalysisResult;
}

export async function askQuestionAboutAnalysis(question: string, context: AnalysisResult): Promise<string> {
  const model = "gemini-3-flash-preview";
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Eres un asistente inteligente para un analista de RRHH. 
    Basándote en los siguientes resultados de análisis de candidatos:
    ${JSON.stringify(context)}

    Responde a la pregunta del analista: "${question}"
    Sé profesional y basa tus respuestas únicamente en los datos proporcionados. 
    Responde en español.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      temperature: 0.7
    }
  });

  return response.text || "No pude generar una respuesta.";
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}
