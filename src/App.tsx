/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Verb } from './data/verbs';
import { starterWords, WordCard } from './data/words';
import { RoundResult, LearningProgress, WordRoundResult } from './types';
import Flashcard from './components/Flashcard';
import Menu from './components/Menu';
import Summary from './components/Summary';
import WordFlashcard from './components/WordFlashcard';
import WordSummary from './components/WordSummary';
import StudyWordsDeck from './components/StudyWordsDeck';
import { BookOpen, ArrowLeft } from 'lucide-react';

const PROGRESS_STORAGE_KEY = 'dutch_irregular_verbs_progress_v1';

type GameState = 'menu' | 'playing' | 'summary';
type PracticeMode = 'verbs' | 'wordsQuiz' | 'wordsStudy';

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

function shuffleItems<T>(items: T[]): T[] {
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
  const [gameState, setGameState] = useState<GameState>('menu');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('verbs');

  const [gameQueue, setGameQueue] = useState<Verb[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [initialRoundVerbs, setInitialRoundVerbs] = useState<Verb[]>([]);
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  const [wordQueue, setWordQueue] = useState<WordCard[]>([]);
  const [wordResults, setWordResults] = useState<WordRoundResult[]>([]);

  const handleStartVerbs = (selectedVerbs: Verb[]) => {
    const shuffled = shuffleItems(selectedVerbs);
    setPracticeMode('verbs');
    setInitialRoundVerbs(selectedVerbs);
    setGameQueue(shuffled);
    setResults([]);
    setGameState('playing');
  };

  const handleStartWordsQuiz = () => {
    setPracticeMode('wordsQuiz');
    setWordQueue(shuffleItems(starterWords));
    setWordResults([]);
    setGameState('playing');
  };

  const handleStartWordsStudy = () => {
    setPracticeMode('wordsStudy');
    setGameState('playing');
  };

  const handleRestart = () => {
    if (practiceMode === 'verbs') {
      handleStartVerbs(initialRoundVerbs);
      return;
    }

    handleStartWordsQuiz();
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

  const handleWordCardResult = (result: WordRoundResult) => {
    const updatedResults = [...wordResults, result];
    setWordResults(updatedResults);

    const newQueue = wordQueue.slice(1);
    setWordQueue(newQueue);

    if (newQueue.length === 0) {
      setGameState('summary');
    }
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setGameQueue([]);
    setResults([]);
    setWordQueue([]);
    setWordResults([]);
  };

  const handleResetProgress = () => {
    setProgress(emptyProgress);
    saveProgress(emptyProgress);
  };

  const currentVerb = gameQueue[0];
  const totalRoundCount = results.length + gameQueue.length;
  const currentIndex = results.length + 1;

  const currentWord = wordQueue[0];
  const wordsTotalCount = wordResults.length + wordQueue.length;
  const wordsCurrentIndex = wordResults.length + 1;

  const title =
    practiceMode === 'verbs'
      ? 'Dutch Verbs Trainer'
      : practiceMode === 'wordsQuiz'
        ? 'Dutch Words Quiz'
        : 'Dutch Words Flashcards';

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-violet-100 px-4 py-10 text-stone-900">
      <div className="mx-auto flex min-h-[88vh] w-full max-w-4xl flex-col">
        <header className="relative mb-8 text-center">
          {gameState !== 'menu' && (
            <button
              onClick={handleBackToMenu}
              className="absolute left-0 top-0 rounded-xl bg-white/80 p-2 text-stone-500 shadow-sm transition hover:text-stone-700"
              title="Back to Menu"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-400/50">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {gameState === 'menu' && (
            <p className="mx-auto mt-2 max-w-xl text-stone-600">
              Оновлений дизайн + новий режим вивчення слів картками для швидкого запам'ятовування.
            </p>
          )}
        </header>

        <main className="w-full flex-1">
          {gameState === 'menu' && (
            <Menu
              onStartVerbs={handleStartVerbs}
              onStartWordsQuiz={handleStartWordsQuiz}
              onStartWordsStudy={handleStartWordsStudy}
              progress={progress}
              onResetProgress={handleResetProgress}
            />
          )}

          {gameState === 'playing' && practiceMode === 'verbs' && currentVerb && (
            <Flashcard
              verb={currentVerb}
              currentIndex={currentIndex}
              totalCount={totalRoundCount}
              onNext={handleCardResult}
            />
          )}

          {gameState === 'playing' && practiceMode === 'wordsQuiz' && currentWord && (
            <WordFlashcard
              word={currentWord}
              currentIndex={wordsCurrentIndex}
              totalCount={wordsTotalCount}
              onNext={handleWordCardResult}
            />
          )}

          {gameState === 'playing' && practiceMode === 'wordsStudy' && (
            <StudyWordsDeck words={starterWords} onBack={handleBackToMenu} />
          )}

          {gameState === 'summary' && practiceMode === 'verbs' && (
            <Summary
              results={results}
              progress={progress}
              onRestart={handleRestart}
              onHome={handleBackToMenu}
            />
          )}

          {gameState === 'summary' && practiceMode === 'wordsQuiz' && (
            <WordSummary results={wordResults} onRestart={handleRestart} onHome={handleBackToMenu} />
          )}
        </main>
      </div>
    </div>
  );
}
