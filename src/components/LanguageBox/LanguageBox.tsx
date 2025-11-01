import React from 'react';
import styles from './LanguageBox.module.css';

type Props = {
  lang: string;
  value: string;
  onChange: (v: string) => void;
  translateEnabled: boolean;
  onToggleTranslate: () => void;
  isSource: boolean;
  isEditable: boolean;
};

export const LanguageBox = ({
  lang,
  value,
  onChange,
  translateEnabled,
  onToggleTranslate,
  isSource,
  isEditable,
}: Props) => {
  const labels: Record<string, string> = {
    de: '🇩🇪 Немецкий',
    en: '🇬🇧 Английский',
    ru: '🇷🇺 Русский',
  };

  const boxClass = `${styles.root} ${isEditable ? styles.editable : styles.readonly} ${
    !translateEnabled && !isSource ? styles.disabled : ''
  }`;

  return (
    <div className={boxClass}>
      <label className={styles.label}>{labels[lang]}</label>

      <textarea
        className={styles.textarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={!isEditable}
      />

      {!isSource && (
        <label className={styles.switch}>
          <input type="checkbox" checked={translateEnabled} onChange={onToggleTranslate} />
          <span className={styles.switchLabel}>Переводить на этот язык</span>
        </label>
      )}
    </div>
  );
};
