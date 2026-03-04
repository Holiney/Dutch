import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, RefreshCw, RotateCcw, X } from 'lucide-react';
import { WordCard } from '../data/words';
import { WordRoundResult, WordsMode } from '../types';

interface WordFlashcardProps {
  word: WordCard;
  currentIndex: number;
  totalCount: number;
  mode: WordsMode;
  onNext: (result: WordRoundResult) => void;
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[’']/g, "'").trim();
}

function getAcceptedAnswers(expectedAnswer: string) {
  return expectedAnswer
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function WordFlashcard({ word, currentIndex, totalCount, mode, onNext }: WordFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setIsFlipped(false);
    setAnswer('');
  }, [word]);

  const config = useMemo(() => {
    if (mode === 'quizUkToNl') {
      return {
        promptText: word.translation,
        promptHint: 'Напиши нідерландською',
        expectedAnswer: word.dutch,
        header: 'Українська → Нідерландська',
      };
    }

    return {
      promptText: word.dutch,
      promptHint: 'Напиши українською',
      expectedAnswer: word.translation,
      header: 'Нідерландська → Українська',
    };
  }, [mode, word.dutch, word.translation]);

  const acceptedAnswers = getAcceptedAnswers(config.expectedAnswer);
  const isCorrect = acceptedAnswers.some((expected) => normalize(answer) === normalize(expected));

  return (
    <div className="mx-auto w-full max-w-md perspective-1000">
      <div className="mb-4 flex items-center justify-between text-sm font-medium text-stone-500">
        <span>Слово {currentIndex} з {totalCount}</span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-stone-200">
          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(currentIndex / totalCount) * 100}%` }} />
        </div>
      </div>

      <div className="relative h-[500px] w-full" style={{ perspective: '1000px' }}>
        <motion.div
          className="relative h-full w-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute flex h-full w-full flex-col items-center justify-between rounded-2xl border border-stone-200 bg-white p-8 shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
            <div className="flex w-full items-center justify-between text-stone-400">
              <span className="text-xs uppercase tracking-wider">Starter words</span>
              <span className="text-xs uppercase tracking-wider">{word.category}</span>
            </div>

            <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-indigo-600">{config.header}</p>
                <h2 className="mb-2 text-4xl font-semibold text-stone-800">{config.promptText}</h2>
                <p className="text-sm text-stone-500">{config.promptHint}</p>
              </div>

              <input
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && answer.trim()) {
                    event.preventDefault();
                    setIsFlipped(true);
                  }
                }}
                placeholder="твоя відповідь"
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              onClick={() => setIsFlipped(true)}
              disabled={!answer.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <Check className="h-4 w-4" /> Перевірити
            </button>
          </div>

          <div className="absolute flex h-full w-full flex-col items-center justify-between rounded-2xl bg-indigo-600 p-8 text-white shadow-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="flex w-full items-center justify-between text-indigo-200">
              <span className="text-xs uppercase tracking-wider">Результат</span>
              <RotateCcw className="h-4 w-4" />
            </div>

            <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
              <p className="text-2xl font-medium">{config.promptText}</p>
              <div className="w-full rounded-xl bg-indigo-700/50 p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-indigo-200">Твоя відповідь</p>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className={isCorrect ? 'font-semibold text-green-300' : 'font-semibold text-red-300 line-through'}>{answer || '—'}</span>
                  {isCorrect ? <Check className="h-4 w-4 text-green-300" /> : <X className="h-4 w-4 text-red-300" />}
                </div>
                <p className="text-lg font-medium">{acceptedAnswers.join(' / ')}</p>
              </div>
            </div>

            <div className="flex w-full justify-center gap-3">
              <button onClick={() => setIsFlipped(false)} className="rounded-full bg-indigo-800 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-900">
                Назад
              </button>
              <button
                onClick={() =>
                  onNext({
                    word,
                    userAnswer: answer,
                    expectedAnswer: config.expectedAnswer,
                    promptText: config.promptText,
                    status: isCorrect ? 'correct' : 'incorrect',
                  })
                }
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                <RefreshCw className="h-4 w-4" /> Далі
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
