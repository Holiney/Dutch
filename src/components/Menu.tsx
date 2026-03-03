import { useState } from 'react';
import { verbs } from '../data/verbs';
import { LearningProgress } from '../types';
import { Play, ListFilter, RotateCcw } from 'lucide-react';

interface MenuProps {
  onStart: (selectedVerbs: typeof verbs) => void;
  progress: LearningProgress;
  onResetProgress: () => void;
}

export default function Menu({ onStart, progress, onResetProgress }: MenuProps) {
  const [mode, setMode] = useState<'all' | 'range'>('all');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(verbs.length - 1);

  const handleStart = () => {
    if (mode === 'all') {
      onStart(verbs);
    } else {
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      const selected = verbs.slice(start, end + 1);
      onStart(selected);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-stone-200">
      <h2 className="text-2xl font-serif font-medium text-stone-900 mb-6 text-center">Choose Your Practice</h2>

      <div className="space-y-6">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Your Progress</h3>
            <button
              type="button"
              onClick={onResetProgress}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-indigo-100">
              <p className="text-stone-500 text-xs uppercase">Rounds</p>
              <p className="text-xl font-semibold text-stone-800">{progress.roundsCompleted}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-indigo-100">
              <p className="text-stone-500 text-xs uppercase">Words</p>
              <p className="text-xl font-semibold text-stone-800">{progress.verbsPracticed}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-indigo-100">
              <p className="text-stone-500 text-xs uppercase">Accuracy</p>
              <p className="text-xl font-semibold text-stone-800">{progress.answerAccuracy}%</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-indigo-100">
              <p className="text-stone-500 text-xs uppercase">Best Round</p>
              <p className="text-xl font-semibold text-stone-800">{progress.bestRoundScore}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setMode('all')}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            All Words
          </button>
          <button
            onClick={() => setMode('range')}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === 'range' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Select Range
          </button>
        </div>

        {mode === 'range' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide ml-1">Start Word</label>
              <select
                value={startIndex}
                onChange={(e) => setStartIndex(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {verbs.map((verb, index) => (
                  <option key={`start-${index}`} value={index}>
                    {verb.infinitive}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-wide ml-1">End Word</label>
              <select
                value={endIndex}
                onChange={(e) => setEndIndex(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {verbs.map((verb, index) => (
                  <option key={`end-${index}`} value={index}>
                    {verb.infinitive}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700 text-sm flex items-start gap-2">
              <ListFilter className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                Selected range: <strong>{Math.abs(endIndex - startIndex) + 1}</strong> words
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-600/20"
        >
          <Play className="w-4 h-4" />
          Start Practice
        </button>
      </div>
    </div>
  );
}
