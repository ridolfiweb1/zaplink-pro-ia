
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { context } = await req.json();
    
    // Usando a API do DeepSeek (compatível com OpenAI)
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente que sugere mensagens curtas e profissionais de saudação para WhatsApp. Responda apenas com o texto da mensagem, sem aspas ou explicações extras.'
          },
          {
            role: 'user',
            content: `Sugira uma mensagem curta e profissional de saudação para WhatsApp baseada neste contexto: "${context}". Se não houver contexto, forneça uma saudação padrão amigável como "Olá! Gostaria de saber mais sobre seus serviços."`
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Olá! Gostaria de mais informações.";

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Server-side DeepSeek error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate suggestion' }), { status: 500 });
  }
}
