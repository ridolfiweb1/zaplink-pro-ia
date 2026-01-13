
/**
 * Chamar a API interna (/api/suggest) em vez de instanciar o SDK no frontend.
 * Isso mantém a API_KEY segura no ambiente da Vercel.
 */
export const suggestMessage = async (context: string): Promise<string> => {
  try {
    const response = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.text || "Olá! Gostaria de mais informações.";
  } catch (error) {
    console.error("Error calling suggest API:", error);
    return "Olá! Gostaria de falar com você.";
  }
};
