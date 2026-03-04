import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, RefreshCw, RotateCcw, X } from 'lucide-react';
import { WordCard } from '../data/words';
import { WordRoundResult } from '../types';

interface WordFlashcardProps {
  word: WordCard;
  currentIndex: number;
  totalCount: number;
  mode: 'uaToNl' | 'nlToUa';
  onNext: (result: WordRoundResult) => void;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[’']/g, "'").trim();
}

export default function WordFlashcard({ word, currentIndex, totalCount, mode, onNext }: WordFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setIsFlipped(false);
    setAnswer('');
  }, [word]);

  const promptWord = useMemo(() => (mode === 'uaToNl' ? word.translation : word.dutch), [mode, word]);
  const expectedAnswer = useMemo(() => (mode === 'uaToNl' ? word.dutch : word.translation), [mode, word]);
  const hintText = mode === 'uaToNl' ? 'Напиши переклад нідерландською' : 'Напиши переклад українською';

  const isCorrect = normalize(answer) === normalize(expectedAnswer);

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div className="mb-4 flex justify-between items-center text-sm font-medium text-stone-500">
        <span>Word {currentIndex} of {totalCount}</span>
        <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(currentIndex / totalCount) * 100}%` }} />
        </div>
      </div>

      <div className="relative w-full h-[500px]" style={{ perspective: '1000px' }}>
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-stone-200 p-8 flex flex-col items-center justify-between" style={{ backfaceVisibility: 'hidden' }}>
            <div className="w-full flex justify-between items-center text-stone-400">
              <span className="text-xs font-mono uppercase tracking-wider">Starter words</span>
              <span className="text-xs font-mono uppercase tracking-wider">{word.category}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full gap-6">
              <div className="text-center">
                <h2 className="text-5xl font-serif font-medium text-stone-800 mb-2">{promptWord}</h2>
                {mode === 'nlToUa' && <p className="text-xs text-stone-500">Транскрипція: {word.transcription}</p>}
                <p className="text-stone-500 text-sm mt-2">{hintText}</p>
              </div>

              <div className="w-full">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && answer.trim()) {
                      e.preventDefault();
                      setIsFlipped(true);
                    }
                  }}
                  placeholder="твоя відповідь"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setIsFlipped(true)}
              disabled={!answer.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-stone-900 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-full hover:bg-stone-800 transition-colors text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              Check Answer
            </button>
          </div>

          <div className="absolute w-full h-full backface-hidden bg-indigo-600 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-between text-white" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="w-full flex justify-between items-center text-indigo-200">
              <span className="text-xs font-mono uppercase tracking-wider">Result</span>
              <RotateCcw className="w-4 h-4" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full gap-6 text-center">
              <p className="text-3xl font-serif">{promptWord}</p>
              <div className="bg-indigo-700/50 rounded-xl p-4 w-full">
                <p className="text-xs uppercase tracking-wide text-indigo-200 mb-2">Your answer</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={isCorrect ? 'text-green-300 font-semibold' : 'text-red-300 line-through font-semibold'}>{answer || '—'}</span>
                  {isCorrect ? <Check className="w-4 h-4 text-green-300" /> : <X className="w-4 h-4 text-red-300" />}
                </div>
                <p className="text-lg font-medium">{expectedAnswer}</p>
              </div>
            </div>

            <div className="w-full flex justify-center gap-3">
              <button onClick={() => setIsFlipped(false)} className="px-6 py-2 bg-indigo-800 text-white rounded-full hover:bg-indigo-900 transition-colors text-sm font-medium">Back</button>
              <button
                onClick={() => onNext({ word, userAnswer: answer, status: isCorrect ? 'correct' : 'incorrect' })}
                className="flex items-center gap-2 px-6 py-2 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Next Word
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
