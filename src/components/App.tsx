'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { LanguageBox } from './LanguageBox';
import styles from './App.module.css';

const languages: ('de' | 'en' | 'ru')[] = ['de', 'en', 'ru'];

export default function App() {
  const [texts, setTexts] = useState({ de: '', en: '', ru: '' });
  const [source, setSource] = useState<'de' | 'en' | 'ru'>('de');
  const [loading, setLoading] = useState(false);
  const [translateTo, setTranslateTo] = useState({ de: true, en: true, ru: true });
  const [order, setOrder] = useState(languages);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleTranslate = async () => {
    setLoading(true);

    const targetLangs = languages.filter(
      (l): l is 'de' | 'en' | 'ru' => l !== source && translateTo[l]
    );

    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceLang: source,
        text: texts[source],
        targetLangs,
      }),
    });

    const data = await res.json();
    setTexts(prev => ({ ...prev, ...data }));
    setLoading(false);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(order);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setOrder(items);
    setSource(items[0]);
  };

  return (
    <div className={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="languages" direction={isMobile ? 'vertical' : 'horizontal'}>
          {provided => (
            <div className={styles.grid} {...provided.droppableProps} ref={provided.innerRef}>
              {order.map((lang, index) => (
                <Draggable key={lang} draggableId={lang} index={index}>
                  {providedDrag => (
                    <div
                      ref={providedDrag.innerRef}
                      {...providedDrag.draggableProps}
                      {...providedDrag.dragHandleProps}
                      className={`${styles.box} ${source === lang ? styles.activeBox : ''}`}
                    >
                      <LanguageBox
                        lang={lang}
                        value={texts[lang]}
                        onChange={val => setTexts(prev => ({ ...prev, [lang]: val }))}
                        translateEnabled={translateTo[lang]}
                        onToggleTranslate={() =>
                          setTranslateTo(prev => ({ ...prev, [lang]: !prev[lang] }))
                        }
                        isSource={source === lang}
                        isEditable={index === 0}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={handleTranslate} disabled={loading} className={styles.button}>
        {loading ? 'Перевожу…' : 'Перевести'}
      </button>
    </div>
  );
}
