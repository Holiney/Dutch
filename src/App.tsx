/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Verb } from './data/verbs';
import { LearningProgress } from './types';
import Flashcard from './components/Flashcard';
import Menu from './components/Menu';
import Summary from './components/Summary';
import WordFlashcard from './components/WordFlashcard';
import WordSummary from './components/WordSummary';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { useVerbsPractice } from './hooks/useVerbsPractice';
import { useWordsPractice } from './hooks/useWordsPractice';

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

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'summary'>('menu');
  const [practiceMode, setPracticeMode] = useState<'verbs' | 'words'>('verbs');
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  const verbs = useVerbsPractice({
    progress,
    onProgressChange: (updated) => {
      setProgress(updated);
      saveProgress(updated);
    },
  });

  const words = useWordsPractice();

  const handleStartVerbs = (selectedVerbs: Verb[]) => {
    setPracticeMode('verbs');
    verbs.start(selectedVerbs);
    setGameState('playing');
  };

  const handleStartWords = () => {
    setPracticeMode('words');
    words.start();
    setGameState('playing');
  };

  const handleRestart = () => {
    if (practiceMode === 'verbs') {
      verbs.restart();
    } else {
      words.start();
    }
    setGameState('playing');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    verbs.clear();
    words.clear();
  };

  const handleResetProgress = () => {
    setProgress(emptyProgress);
    saveProgress(emptyProgress);
  };

  const currentVerb = verbs.queue[0];
  const totalRoundCount = verbs.results.length + verbs.queue.length;
  const currentIndex = verbs.results.length + 1;

  const currentWord = words.queue[0];
  const wordsTotalCount = words.results.length + words.queue.length;
  const wordsCurrentIndex = words.results.length + 1;

  const title = practiceMode === 'verbs' ? 'Dutch Irregular Verbs' : 'Dutch Starter Words';
  const subtitle =
    practiceMode === 'verbs'
      ? 'Practice your Imperfectum and Perfectum forms.'
      : 'Practice your starter vocabulary with flashcards.';

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
        <h1 className="text-3xl font-serif font-medium tracking-tight text-stone-900">{title}</h1>
        {gameState === 'menu' && <p className="text-stone-500 max-w-md mx-auto">{subtitle}</p>}
      </header>

      <main className="w-full max-w-2xl">
        {gameState === 'menu' && (
          <Menu
            onStartVerbs={handleStartVerbs}
            onStartWords={handleStartWords}
            progress={progress}
            onResetProgress={handleResetProgress}
          />
        )}

        {gameState === 'playing' && practiceMode === 'verbs' && currentVerb && (
          <Flashcard
            verb={currentVerb}
            currentIndex={currentIndex}
            totalCount={totalRoundCount}
            onNext={(result) => {
              const isFinished = verbs.submitCard(result);
              if (isFinished) setGameState('summary');
            }}
          />
        )}

        {gameState === 'playing' && practiceMode === 'words' && currentWord && (
          <WordFlashcard
            word={currentWord}
            currentIndex={wordsCurrentIndex}
            totalCount={wordsTotalCount}
            onNext={(result) => {
              const isFinished = words.submitCard(result);
              if (isFinished) setGameState('summary');
            }}
          />
        )}

        {gameState === 'summary' && practiceMode === 'verbs' && (
          <Summary
            results={verbs.results}
            progress={progress}
            onRestart={handleRestart}
            onHome={handleBackToMenu}
          />
        )}

        {gameState === 'summary' && practiceMode === 'words' && (
          <WordSummary results={words.results} onRestart={handleRestart} onHome={handleBackToMenu} />
        )}
      </main>

      <footer className="mt-auto pt-12 text-center text-stone-400 text-sm">
        {gameState === 'menu' ? <p>Ready to practice?</p> : <p>{gameState === 'playing' ? 'Keep going!' : 'Well done!'}</p>}
      </footer>
    </div>
  );
}
