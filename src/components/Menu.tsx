import { useState } from 'react';
import { verbs } from '../data/verbs';
import { LearningProgress } from '../types';
import { Play, ListFilter, RotateCcw, Languages, BookMarked } from 'lucide-react';

interface MenuProps {
  onStartVerbs: (selectedVerbs: typeof verbs) => void;
  onStartWordsQuiz: () => void;
  onStartWordsStudy: () => void;
  progress: LearningProgress;
  onResetProgress: () => void;
}

export default function Menu({
  onStartVerbs,
  onStartWordsQuiz,
  onStartWordsStudy,
  progress,
  onResetProgress,
}: MenuProps) {
  const [section, setSection] = useState<'verbs' | 'words'>('verbs');
  const [mode, setMode] = useState<'all' | 'range'>('all');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(verbs.length - 1);

  const handleStartVerbs = () => {
    if (mode === 'all') {
      onStartVerbs(verbs);
      return;
    }

    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    onStartVerbs(verbs.slice(start, end + 1));
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/40 bg-white/75 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <h2 className="mb-6 text-center text-3xl font-semibold text-stone-900">Оберіть режим навчання</h2>

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-1">
        <button
          onClick={() => setSection('verbs')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            section === 'verbs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Дієслова
        </button>
        <button
          onClick={() => setSection('words')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            section === 'words' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Слова
        </button>
      </div>

      {section === 'verbs' ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Прогрес по дієсловах</h3>
              <button
                type="button"
                onClick={onResetProgress}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
              >
                <RotateCcw className="h-3 w-3" />
                Скинути
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <MetricCard label="Раунди" value={progress.roundsCompleted} />
              <MetricCard label="Слів" value={progress.verbsPracticed} />
              <MetricCard label="Точність" value={`${progress.answerAccuracy}%`} />
              <MetricCard label="Кращий раунд" value={progress.bestRoundScore} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-1">
            <button
              onClick={() => setMode('all')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                mode === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Play className="h-4 w-4" />
                Усі
              </span>
            </button>
            <button
              onClick={() => setMode('range')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                mode === 'range' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                Діапазон
              </span>
            </button>
          </div>

          {mode === 'range' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="text-stone-500">Початок ({startIndex + 1})</span>
                <input
                  type="range"
                  min={0}
                  max={verbs.length - 1}
                  value={startIndex}
                  onChange={(event) => setStartIndex(Number(event.target.value))}
                  className="w-full"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-stone-500">Кінець ({endIndex + 1})</span>
                <input
                  type="range"
                  min={0}
                  max={verbs.length - 1}
                  value={endIndex}
                  onChange={(event) => setEndIndex(Number(event.target.value))}
                  className="w-full"
                />
              </label>
            </div>
          )}

          <button
            onClick={handleStartVerbs}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <Play className="h-4 w-4" />
            Почати тренування дієслів
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={onStartWordsQuiz}
            className="flex w-full items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left hover:bg-indigo-100"
          >
            <Languages className="mt-1 h-5 w-5 text-indigo-600" />
            <span>
              <span className="block font-semibold text-stone-900">Тренування перекладу</span>
              <span className="text-sm text-stone-600">Введи український переклад і отримай результат.</span>
            </span>
          </button>

          <button
            onClick={onStartWordsStudy}
            className="flex w-full items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-left hover:bg-emerald-100"
          >
            <BookMarked className="mt-1 h-5 w-5 text-emerald-700" />
            <span>
              <span className="block font-semibold text-stone-900">Нова функція: картки для вивчення</span>
              <span className="text-sm text-stone-600">Гортай картки, відкривай переклад, відмічай вивчені слова.</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-white p-3">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="text-xl font-semibold text-stone-800">{value}</p>
    </div>
  );
}
