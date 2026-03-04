import { Home, RefreshCw, Check, X } from 'lucide-react';
import { WordRoundResult, WordsMode } from '../types';

interface WordSummaryProps {
  results: WordRoundResult[];
  mode: WordsMode;
  onRestart: () => void;
  onHome: () => void;
}

export default function WordSummary({ results, mode, onRestart, onHome }: WordSummaryProps) {
  const correctCount = results.filter((result) => result.status === 'correct').length;
  const mistakes = results.filter((result) => result.status !== 'correct');

  const modeTitle = mode === 'quizUkToNl' ? 'Українська → Нідерландська' : 'Нідерландська → Українська';

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
      <div className="bg-indigo-600 p-8 text-center text-white">
        <h2 className="mb-2 text-3xl font-serif font-medium">Раунд завершено!</h2>
        <p className="mb-2 text-indigo-100">Режим: {modeTitle}</p>
        <p className="text-indigo-100">
          Правильно: <span className="text-xl font-bold text-white">{correctCount}</span> з{' '}
          <span className="text-xl font-bold text-white">{results.length}</span>
        </p>
      </div>

      <div className="p-8">
        {mistakes.length > 0 ? (
          <div className="space-y-6">
            <h3 className="border-b border-stone-200 pb-2 text-lg font-medium text-stone-900">Розбір помилок</h3>
            <div className="grid gap-4">
              {mistakes.map((result, idx) => (
                <div key={idx} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-serif text-stone-900">{result.promptText}</h4>
                      <p className="text-xs text-stone-500">{result.word.category}</p>
                    </div>
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-sm text-stone-500 line-through">{result.userAnswer || '—'}</p>
                  <p className="text-sm font-medium text-stone-900">{result.expectedAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-8 text-center text-stone-500">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-lg">Perfect score! Чудово!</p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button onClick={onHome} className="flex items-center gap-2 rounded-xl bg-stone-100 px-6 py-3 font-medium text-stone-600 transition-colors hover:bg-stone-200">
            <Home className="h-4 w-4" /> Меню
          </button>
          <button onClick={onRestart} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700">
            <RefreshCw className="h-4 w-4" /> Повторити
          </button>
        </div>
      </div>
    </div>
  );
}
