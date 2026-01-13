
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { context } = await req.json();
    
    // A chave é acessada aqui, no servidor da Vercel, longe do navegador do cliente.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sugira uma mensagem curta e profissional de saudação para WhatsApp baseada neste contexto: "${context}". A resposta deve ser apenas o texto da mensagem, sem aspas ou explicações extras. Se não houver contexto, forneça uma saudação padrão amigável como "Olá! Gostaria de saber mais sobre seus serviços."`,
      config: {
        temperature: 0.7,
      },
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Server-side Gemini error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate suggestion' }), { status: 500 });
  }
}
