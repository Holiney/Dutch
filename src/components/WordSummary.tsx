import { Home, RefreshCw, Check, X } from 'lucide-react';
import { WordRoundResult } from '../types';

interface WordSummaryProps {
  results: WordRoundResult[];
  onRestart: () => void;
  onHome: () => void;
}

export default function WordSummary({ results, onRestart, onHome }: WordSummaryProps) {
  const correctCount = results.filter((result) => result.status === 'correct').length;
  const mistakes = results.filter((result) => result.status !== 'correct');

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div className="bg-indigo-600 p-8 text-center text-white">
        <h2 className="text-3xl font-serif font-medium mb-2">Words Round Complete!</h2>
        <p className="text-indigo-100">
          You got <span className="font-bold text-white text-xl">{correctCount}</span> out of <span className="font-bold text-white text-xl">{results.length}</span> correct
        </p>
      </div>

      <div className="p-8">
        {mistakes.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-stone-900 border-b border-stone-200 pb-2">Review Mistakes</h3>
            <div className="grid gap-4">
              {mistakes.map((result, idx) => (
                <div key={idx} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-xl font-serif text-stone-900">{result.word.dutch}</h4>
                      <p className="text-xs text-stone-500">{result.word.category}</p>
                    </div>
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-sm text-stone-500 line-through">{result.userAnswer || '—'}</p>
                  <p className="text-sm font-medium text-stone-900">{result.word.translation}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500 flex items-center justify-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <p className="text-lg">Perfect score! Чудово!</p>
          </div>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          <button onClick={onHome} className="flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-colors font-medium">
            <Home className="w-4 h-4" />
            Menu
          </button>
          <button onClick={onRestart} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-600/20">
            <RefreshCw className="w-4 h-4" />
            Restart Words
          </button>
        </div>
      </div>
    </div>
  );
}
