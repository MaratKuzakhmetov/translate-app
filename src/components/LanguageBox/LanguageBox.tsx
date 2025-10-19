import React from 'react';

import styles from './LanguageBox.module.css';

type Props = {
  lang: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
};

export const LanguageBox = ({ lang, value, onChange, onFocus }: Props) => {
  const labels: Record<string, string> = {
    de: '🇩🇪 Немецкий',
    en: '🇬🇧 Английский',
    ru: '🇷🇺 Русский',
  };

  return (
    <div className={styles.root}>
      <label className={styles.label}>{labels[lang]}</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
      />
    </div>
  );
};
