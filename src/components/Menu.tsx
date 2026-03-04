import { useState } from 'react';
import { verbs } from '../data/verbs';
import { LearningProgress } from '../types';
import { Play, RotateCcw, Languages, BookMarked, ArrowRightLeft } from 'lucide-react';

interface MenuProps {
  onStartVerbs: (selectedVerbs: typeof verbs) => void;
  onStartWordsStudy: () => void;
  onStartWordsQuizUkToNl: () => void;
  onStartWordsQuizNlToUk: () => void;
  progress: LearningProgress;
  onResetProgress: () => void;
}

export default function Menu({
  onStartVerbs,
  onStartWordsStudy,
  onStartWordsQuizUkToNl,
  onStartWordsQuizNlToUk,
  progress,
  onResetProgress,
}: MenuProps) {
  const [section, setSection] = useState<'verbs' | 'words'>('verbs');
  const [mode, setMode] = useState<'all' | 'range'>('all');
  const [startVerb, setStartVerb] = useState(verbs[0]?.infinitive ?? '');
  const [endVerb, setEndVerb] = useState(verbs[verbs.length - 1]?.infinitive ?? '');

  const handleStartVerbs = () => {
    if (mode === 'all') {
      onStartVerbs(verbs);
      return;
    }

    const startIndex = verbs.findIndex((verb) => verb.infinitive === startVerb);
    const endIndex = verbs.findIndex((verb) => verb.infinitive === endVerb);

    if (startIndex < 0 || endIndex < 0) {
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
        <button onClick={() => setSection('verbs')} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${section === 'verbs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
          Дієслова
        </button>
        <button onClick={() => setSection('words')} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${section === 'words' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
          Слова
        </button>
      </div>

      {section === 'verbs' ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Прогрес по дієсловах</h3>
              <button type="button" onClick={onResetProgress} className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800">
                <RotateCcw className="h-3 w-3" /> Скинути
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
            <button onClick={() => setMode('all')} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${mode === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
              Усі дієслова
            </button>
            <button onClick={() => setMode('range')} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${mode === 'range' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
              Від слова до слова
            </button>
          </div>

          {mode === 'range' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="text-stone-500">Початкове слово</span>
                <select value={startVerb} onChange={(event) => setStartVerb(event.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-800">
                  {verbs.map((verb) => (
                    <option key={verb.infinitive} value={verb.infinitive}>{verb.infinitive}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="text-stone-500">Кінцеве слово</span>
                <select value={endVerb} onChange={(event) => setEndVerb(event.target.value)} className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-800">
                  {verbs.map((verb) => (
                    <option key={verb.infinitive} value={verb.infinitive}>{verb.infinitive}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <button onClick={handleStartVerbs} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700">
            <Play className="h-4 w-4" /> Почати тренування дієслів
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={onStartWordsStudy} className="flex w-full items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-left hover:bg-emerald-100">
            <BookMarked className="mt-1 h-5 w-5 text-emerald-700" />
            <span>
              <span className="block font-semibold text-stone-900">1) Картки: слово + переклад + транскрипція</span>
              <span className="text-sm text-stone-600">Простий режим для запамʼятовування без тесту.</span>
            </span>
          </button>

          <button onClick={onStartWordsQuizUkToNl} className="flex w-full items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left hover:bg-indigo-100">
            <Languages className="mt-1 h-5 w-5 text-indigo-600" />
            <span>
              <span className="block font-semibold text-stone-900">2) Українська → нідерландська</span>
              <span className="text-sm text-stone-600">Бачиш українське слово — пишеш нідерландською.</span>
            </span>
          </button>

          <button onClick={onStartWordsQuizNlToUk} className="flex w-full items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-left hover:bg-violet-100">
            <ArrowRightLeft className="mt-1 h-5 w-5 text-violet-600" />
            <span>
              <span className="block font-semibold text-stone-900">3) Нідерландська → українська</span>
              <span className="text-sm text-stone-600">Бачиш нідерландське слово — пишеш українською.</span>
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
