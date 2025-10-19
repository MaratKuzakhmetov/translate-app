import React from 'react';
import styles from './LanguageBox.module.css';

type Props = {
  lang: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  translateEnabled: boolean;
  onToggleTranslate: () => void;
  isSource: boolean;
};

export const LanguageBox = ({
  lang,
  value,
  onChange,
  onFocus,
  translateEnabled,
  onToggleTranslate,
  isSource,
}: Props) => {
  const labels: Record<string, string> = {
    de: '🇩🇪 Немецкий',
    en: '🇬🇧 Английский',
    ru: '🇷🇺 Русский',
  };

  return (
    <div className={`${styles.root} ${!translateEnabled && !isSource ? styles.disabled : ''}`}>
      <label className={styles.label}>{labels[lang]}</label>

      <textarea
        className={styles.textarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        disabled={!translateEnabled && !isSource}
      />

      {!isSource && (
        <label className={styles.switch}>
          <input type="checkbox" checked={translateEnabled} onChange={onToggleTranslate} />
          <span className={styles.slider}></span>
          <span className={styles.switchLabel}>Переводить на этот язык</span>
        </label>
      )}
    </div>
  );
};
