import { useMemo, useState } from 'react';
import { verbs } from '../data/verbs';
import { LearningProgress } from '../types';
import { Play, ListFilter, RotateCcw, Languages, BookMarked, PencilLine, Construction } from 'lucide-react';

interface MenuProps {
  onStartVerbs: (selectedVerbs: typeof verbs) => void;
  onStartWordsStudy: () => void;
  onStartWordsUaToNlQuiz: () => void;
  onStartWordsNlToUaQuiz: () => void;
  onStartSentenceBuilder: () => void;
  progress: LearningProgress;
  onResetProgress: () => void;
}

export default function Menu({
  onStartVerbs,
  onStartWordsStudy,
  onStartWordsUaToNlQuiz,
  onStartWordsNlToUaQuiz,
  onStartSentenceBuilder,
  progress,
  onResetProgress,
}: MenuProps) {
  const [section, setSection] = useState<'verbs' | 'words' | 'sentenceBuilder'>('verbs');
  const [mode, setMode] = useState<'all' | 'range'>('all');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(verbs.length - 1);

  const sortedBounds = useMemo(() => {
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    return { start, end };
  }, [startIndex, endIndex]);

  const handleStartVerbs = () => {
    if (mode === 'all') {
      onStartVerbs(verbs);
      return;
    }

    onStartVerbs(verbs.slice(sortedBounds.start, sortedBounds.end + 1));
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/40 bg-white/75 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <h2 className="mb-6 text-center text-3xl font-semibold text-stone-900">Оберіть режим навчання</h2>

      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-stone-100 p-1">
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
        <button
          onClick={() => setSection('sentenceBuilder')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            section === 'sentenceBuilder' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Sentence Builder
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
                <span className="text-stone-500">Від слова</span>
                <select
                  value={startIndex}
                  onChange={(event) => setStartIndex(Number(event.target.value))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-700"
                >
                  {verbs.map((verb, index) => (
                    <option key={`start-${verb.infinitive}-${index}`} value={index}>{verb.infinitive}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-stone-500">До слова</span>
                <select
                  value={endIndex}
                  onChange={(event) => setEndIndex(Number(event.target.value))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-700"
                >
                  {verbs.map((verb, index) => (
                    <option key={`end-${verb.infinitive}-${index}`} value={index}>{verb.infinitive}</option>
                  ))}
                </select>
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
      ) : section === 'words' ? (
        <div className="space-y-4">
          <button
            onClick={onStartWordsStudy}
            className="flex w-full items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-left hover:bg-emerald-100"
          >
            <BookMarked className="mt-1 h-5 w-5 text-emerald-700" />
            <span>
              <span className="block font-semibold text-stone-900">Картки: слово + переклад + транскрипція</span>
              <span className="text-sm text-stone-600">Переглядай слова одразу з перекладом і вимовою.</span>
            </span>
          </button>

          <button
            onClick={onStartWordsUaToNlQuiz}
            className="flex w-full items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-left hover:bg-indigo-100"
          >
            <PencilLine className="mt-1 h-5 w-5 text-indigo-600" />
            <span>
              <span className="block font-semibold text-stone-900">Тест: Українська → Нідерландська</span>
              <span className="text-sm text-stone-600">Бачиш українське слово та пишеш відповідник нідерландською.</span>
            </span>
          </button>

          <button
            onClick={onStartWordsNlToUaQuiz}
            className="flex w-full items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-left hover:bg-sky-100"
          >
            <Languages className="mt-1 h-5 w-5 text-sky-700" />
            <span>
              <span className="block font-semibold text-stone-900">Тест: Нідерландська → Українська</span>
              <span className="text-sm text-stone-600">Бачиш слово нідерландською (з транскрипцією) та пишеш переклад українською.</span>
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <p className="text-sm text-violet-900">
              Щоденний тренажер структури речень: порядок слів, perfectum, imperfectum, питання, zelf/laten.
            </p>
          </div>

          <button
            onClick={onStartSentenceBuilder}
            className="flex w-full items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-left hover:bg-violet-100"
          >
            <Construction className="mt-1 h-5 w-5 text-violet-700" />
            <span>
              <span className="block font-semibold text-stone-900">Sentence Builder (1–5 хв)</span>
              <span className="text-sm text-stone-600">
                6 режимів: normal sentence, question builder, perfectum, imperfectum, zelf vs laten, fix sentence.
              </span>
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
