// Integración con Gemini API (Google AI Studio)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

/**
 * Genera contenido usando Gemini API.
 * @param {string} prompt - El prompt a enviar a Gemini
 * @returns {string|null} - El texto generado o null si falla
 */
const generarContenido = async (prompt) => {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY no configurado');
    return null;
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }] 
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error('Error en Gemini API:', error.message);
    return null;
  }
};

module.exports = { generarContenido };
