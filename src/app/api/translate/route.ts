import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { sourceLang, text, targetLangs } = await req.json();

  const targets =
    Array.isArray(targetLangs) && targetLangs.length > 0
      ? targetLangs
      : ['de', 'en', 'ru'].filter(l => l !== sourceLang);

  const results: Record<string, string> = {};

  try {
    const prompt = `Translate this text from ${sourceLang.toUpperCase()} into ${targets
      .map(l => l.toUpperCase())
      .join(' and ')}. 
Return the result strictly as a JSON object with only the requested language codes as keys. 
Example: {"de":"...", "ru":"..."}.
    
Text:
"${text}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const gptResult = JSON.parse(completion.choices[0].message?.content || '{}');
    Object.assign(results, gptResult);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
