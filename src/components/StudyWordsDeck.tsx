import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, BookCheck, BookOpen } from 'lucide-react';
import { WordCard } from '../data/words';

interface StudyWordsDeckProps {
  words: WordCard[];
  onBack: () => void;
}

export default function StudyWordsDeck({ words, onBack }: StudyWordsDeckProps) {
  const [index, setIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [knownWords, setKnownWords] = useState<string[]>([]);

  const currentWord = words[index];

  const progress = useMemo(() => {
    if (words.length === 0) return 0;
    return Math.round((knownWords.length / words.length) * 100);
  }, [knownWords.length, words.length]);

  const toggleKnown = () => {
    if (!currentWord) return;

    setKnownWords((prev) => {
      if (prev.includes(currentWord.dutch)) {
        return prev.filter((word) => word !== currentWord.dutch);
      }

      return [...prev, currentWord.dutch];
    });
  };

  const goNext = () => {
    setShowTranslation(false);
    setIndex((prev) => (prev + 1) % words.length);
  };

  const goPrev = () => {
    setShowTranslation(false);
    setIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  if (words.length === 0) {
    return (
      <div className="rounded-3xl border border-white/40 bg-white/80 p-8 text-center">
        <p className="text-stone-700">Наразі немає слів для вивчення.</p>
      </div>
    );
  }

  const isKnown = knownWords.includes(currentWord.dutch);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between text-sm text-stone-600">
          <p>Картка {index + 1} / {words.length}</p>
          <p>Запам'ятано: <span className="font-semibold text-emerald-600">{knownWords.length}</span> ({progress}%)</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-3xl border border-indigo-100 bg-white p-8 text-center shadow-xl">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-stone-500">{currentWord.category}</p>
        <p className="text-4xl font-semibold text-stone-900">{currentWord.dutch}</p>

        <div className="my-6">
          {showTranslation ? (
            <p className="text-2xl font-medium text-indigo-600">{currentWord.translation}</p>
          ) : (
            <p className="text-stone-400">Натисни, щоб побачити переклад</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowTranslation((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-black"
        >
          <RotateCcw className="h-4 w-4" />
          {showTranslation ? 'Сховати переклад' : 'Показати переклад'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button type="button" onClick={goPrev} className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
          <ChevronLeft className="h-4 w-4" />
          Назад
        </button>

        <button
          type="button"
          onClick={toggleKnown}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white ${
            isKnown ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isKnown ? <BookCheck className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
          {isKnown ? 'Вже знаю' : 'Позначити як вивчене'}
        </button>

        <button type="button" onClick={goNext} className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
          Далі
          <ChevronRight className="h-4 w-4" />
        </button>

        <button type="button" onClick={onBack} className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
          У меню
        </button>
      </div>
    </section>
  );
}
