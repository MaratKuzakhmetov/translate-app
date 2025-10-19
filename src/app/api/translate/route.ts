import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { sourceLang, text, mode } = await req.json();

  const targetLangs = ['de', 'en', 'ru'].filter(l => l !== sourceLang);
  const results: Record<string, string> = {};

  try {
    if (mode === 'google') {
      // 🟢 Google Translate API
      const googleApiKey = process.env.GOOGLE_API_KEY;
      for (const target of targetLangs) {
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
        results[target] = data.data.translations[0].translatedText;
      }
    } else {
      // 🔵 OpenAI GPT translation
      const prompt = `Translate this text into ${targetLangs.join(
        ' and '
      )}:\n"${text}"\nRespond strictly in JSON format like {"de":"...","en":"...","ru":"..."}.`;

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
