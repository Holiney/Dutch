/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Verb } from './data/verbs';
import { RoundResult, LearningProgress } from './types';
import Flashcard from './components/Flashcard';
import Menu from './components/Menu';
import Summary from './components/Summary';
import { BookOpen, ArrowLeft } from 'lucide-react';

const PROGRESS_STORAGE_KEY = 'dutch_irregular_verbs_progress_v1';

const emptyProgress: LearningProgress = {
  roundsCompleted: 0,
  verbsPracticed: 0,
  fullyCorrect: 0,
  answerAccuracy: 0,
  bestRoundScore: 0,
};

function loadProgress(): LearningProgress {
  if (typeof window === 'undefined') return emptyProgress;

  const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) return emptyProgress;

  try {
    const parsed = JSON.parse(raw) as LearningProgress;
    return {
      roundsCompleted: parsed.roundsCompleted ?? 0,
      verbsPracticed: parsed.verbsPracticed ?? 0,
      fullyCorrect: parsed.fullyCorrect ?? 0,
      answerAccuracy: parsed.answerAccuracy ?? 0,
      bestRoundScore: parsed.bestRoundScore ?? 0,
    };
  } catch {
    return emptyProgress;
  }
}

function saveProgress(progress: LearningProgress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

function shuffleVerbs(items: Verb[]): Verb[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function calculateUpdatedProgress(
  currentProgress: LearningProgress,
  roundResults: RoundResult[],
): LearningProgress {
  const roundCorrect = roundResults.filter(
    (result) => result.imperfectStatus === 'correct' && result.perfectStatus === 'correct',
  ).length;

  const newRoundsCompleted = currentProgress.roundsCompleted + 1;
  const newVerbsPracticed = currentProgress.verbsPracticed + roundResults.length;
  const newFullyCorrect = currentProgress.fullyCorrect + roundCorrect;
  const newAnswerAccuracy =
    newVerbsPracticed === 0 ? 0 : Math.round((newFullyCorrect / newVerbsPracticed) * 100);

  return {
    roundsCompleted: newRoundsCompleted,
    verbsPracticed: newVerbsPracticed,
    fullyCorrect: newFullyCorrect,
    answerAccuracy: newAnswerAccuracy,
    bestRoundScore: Math.max(currentProgress.bestRoundScore, roundCorrect),
  };
}

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'summary'>('menu');
  const [gameQueue, setGameQueue] = useState<Verb[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [initialRoundVerbs, setInitialRoundVerbs] = useState<Verb[]>([]);
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  const handleStart = (selectedVerbs: Verb[]) => {
    const shuffled = shuffleVerbs(selectedVerbs);
    setInitialRoundVerbs(selectedVerbs);
    setGameQueue(shuffled);
    setResults([]);
    setGameState('playing');
  };

  const handleRestart = () => {
    handleStart(initialRoundVerbs);
  };

  const handleCardResult = (result: RoundResult) => {
    const updatedResults = [...results, result];
    setResults(updatedResults);

    const newQueue = gameQueue.slice(1);
    setGameQueue(newQueue);

    if (newQueue.length === 0) {
      const updatedProgress = calculateUpdatedProgress(progress, updatedResults);
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
      setGameState('summary');
    }
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setGameQueue([]);
    setResults([]);
  };

  const handleResetProgress = () => {
    setProgress(emptyProgress);
    saveProgress(emptyProgress);
  };

  const currentVerb = gameQueue[0];
  const totalRoundCount = results.length + gameQueue.length;
  const currentIndex = results.length + 1;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center py-12 px-4 font-sans text-stone-900">
      <header className="mb-8 text-center space-y-2 relative w-full max-w-2xl">
        {gameState !== 'menu' && (
          <button
            onClick={handleBackToMenu}
            className="absolute left-0 top-0 p-2 text-stone-400 hover:text-stone-600 transition-colors"
            title="Back to Menu"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-600/20">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif font-medium tracking-tight text-stone-900">Dutch Irregular Verbs</h1>
        {gameState === 'menu' && (
          <p className="text-stone-500 max-w-md mx-auto">Practice your Imperfectum and Perfectum forms.</p>
        )}
      </header>

      <main className="w-full max-w-2xl">
        {gameState === 'menu' && <Menu onStart={handleStart} progress={progress} onResetProgress={handleResetProgress} />}

        {gameState === 'playing' && currentVerb && (
          <Flashcard verb={currentVerb} currentIndex={currentIndex} totalCount={totalRoundCount} onNext={handleCardResult} />
        )}

        {gameState === 'summary' && (
          <Summary results={results} progress={progress} onRestart={handleRestart} onHome={handleBackToMenu} />
        )}
      </main>

      <footer className="mt-auto pt-12 text-center text-stone-400 text-sm">
        {gameState === 'menu' ? <p>Ready to practice?</p> : <p>{gameState === 'playing' ? 'Keep going!' : 'Well done!'}</p>}
      </footer>
    </div>
  );
}
