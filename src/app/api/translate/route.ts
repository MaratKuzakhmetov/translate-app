import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { sourceLang, text, mode, targetLangs } = await req.json();

  // Если список языков не пришёл — переводим на все кроме исходного
  const targets =
    Array.isArray(targetLangs) && targetLangs.length > 0
      ? targetLangs
      : ['de', 'en', 'ru'].filter(l => l !== sourceLang);

  const results: Record<string, string> = {};

  try {
    if (mode === 'google') {
      // 🟢 Перевод через Google
      const googleApiKey = process.env.GOOGLE_API_KEY;

      for (const target of targets) {
        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: text,
              source: sourceLang,
              target,
              format: 'text',
            }),
          }
        );

        const data = await res.json();

        // API Google всегда возвращает массив переводов
        results[target] = data.data.translations[0].translatedText;
      }
    } else {
      // 🤖 Перевод через OpenAI GPT
      const prompt = `Translate this text into ${targets.join(
        ' and '
      )}:\n"${text}"\n\nReturn strictly in JSON format like {"de":"...","en":"..."} — include only requested languages.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const gptResult = JSON.parse(completion.choices[0].message?.content || '{}');
      Object.assign(results, gptResult);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
