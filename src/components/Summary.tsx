import { RoundResult } from '../types';
import { RefreshCw, Home, Check, X, AlertCircle } from 'lucide-react';

interface SummaryProps {
  results: RoundResult[];
  onRestart: () => void;
  onHome: () => void;
}

export default function Summary({ results, onRestart, onHome }: SummaryProps) {
  const correctCount = results.filter(
    r => r.imperfectStatus === 'correct' && r.perfectStatus === 'correct'
  ).length;

  const mistakes = results.filter(
    r => r.imperfectStatus !== 'correct' || r.perfectStatus !== 'correct'
  );

  const getStatusIcon = (status: 'correct' | 'warning' | 'incorrect') => {
    switch (status) {
      case 'correct': return <Check className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'incorrect': return <X className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div className="bg-indigo-600 p-8 text-center text-white">
        <h2 className="text-3xl font-serif font-medium mb-2">Round Complete!</h2>
        <p className="text-indigo-100">
          You got <span className="font-bold text-white text-xl">{correctCount}</span> out of <span className="font-bold text-white text-xl">{results.length}</span> correct
        </p>
      </div>

      <div className="p-8">
        {mistakes.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-stone-900 border-b border-stone-200 pb-2">
              Review Mistakes
            </h3>
            
            <div className="grid gap-4">
              {mistakes.map((result, idx) => (
                <div key={idx} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-serif text-stone-900">{result.verb.infinitive}</h4>
                      <p className="text-xs text-stone-500">{result.verb.translation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Imperfectum Review */}
                    <div className={`p-3 rounded-lg ${result.imperfectStatus !== 'correct' ? 'bg-red-50 border border-red-100' : 'bg-white border border-stone-100'}`}>
                      <p className="text-xs uppercase tracking-wide text-stone-400 mb-1">Imperfectum</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={result.imperfectStatus !== 'correct' ? 'line-through text-stone-400' : 'text-stone-800'}>
                          {result.userImperfect || "—"}
                        </span>
                        {getStatusIcon(result.imperfectStatus)}
                      </div>
                      {result.imperfectStatus !== 'correct' && (
                        <p className="text-sm font-medium text-stone-900">{result.verb.imperfect}</p>
                      )}
                    </div>

                    {/* Perfectum Review */}
                    <div className={`p-3 rounded-lg ${result.perfectStatus !== 'correct' ? 'bg-red-50 border border-red-100' : 'bg-white border border-stone-100'}`}>
                      <p className="text-xs uppercase tracking-wide text-stone-400 mb-1">Perfectum</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={result.perfectStatus !== 'correct' ? 'line-through text-stone-400' : 'text-stone-800'}>
                          {result.userPerfect || "—"}
                        </span>
                        {getStatusIcon(result.perfectStatus)}
                      </div>
                      {result.perfectStatus !== 'correct' && (
                        <p className="text-sm font-medium text-stone-900">{result.verb.perfect}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500">
            <p className="text-lg">Perfect score! Geweldig!</p>
          </div>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Menu
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            Restart Round
          </button>
        </div>
      </div>
    </div>
  );
}
