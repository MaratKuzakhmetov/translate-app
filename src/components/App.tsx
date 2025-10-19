'use client';

import { useState } from 'react';
import { LanguageBox } from './LanguageBox';
import styles from './App.module.css';

export default function App() {
  const [texts, setTexts] = useState({ de: '', en: '', ru: '' });
  const [source, setSource] = useState<'de' | 'en' | 'ru'>('en');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'google' | 'gpt'>('google');
  const [translateTo, setTranslateTo] = useState<{ [key: string]: boolean }>({
    de: true,
    en: true,
    ru: true,
  });

  const handleTranslate = async () => {
    setLoading(true);

    const targetLangs = ['de', 'en', 'ru'].filter(l => l !== source && translateTo[l]);

    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceLang: source,
        text: texts[source],
        mode,
        targetLangs,
      }),
    });

    const data = await res.json();
    setTexts(prev => ({ ...prev, ...data }));
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginTop: '1rem',
          justifyContent: 'center',
        }}
      >
        <label>
          <input
            type="radio"
            value="google"
            checked={mode === 'google'}
            onChange={() => setMode('google')}
          />{' '}
          🌐 Google
        </label>

        <label>
          <input
            type="radio"
            value="gpt"
            checked={mode === 'gpt'}
            onChange={() => setMode('gpt')}
          />{' '}
          🤖 GPT
        </label>
      </div>

      <div className={styles.grid}>
        {['de', 'en', 'ru'].map(lang => (
          <LanguageBox
            key={lang}
            lang={lang}
            value={texts[lang as 'de' | 'en' | 'ru']}
            onChange={val => setTexts(prev => ({ ...prev, [lang]: val }))}
            onFocus={() => setSource(lang as 'de' | 'en' | 'ru')}
            translateEnabled={translateTo[lang]}
            onToggleTranslate={() => setTranslateTo(prev => ({ ...prev, [lang]: !prev[lang] }))}
            isSource={source === lang}
          />
        ))}
      </div>

      <button onClick={handleTranslate} disabled={loading} className={styles.button}>
        {loading ? 'Перевожу…' : 'Перевести'}
      </button>
    </div>
  );
}
