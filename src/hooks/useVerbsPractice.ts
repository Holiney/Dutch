import { useState } from 'react';
import { Verb } from '../data/verbs';
import { LearningProgress, RoundResult } from '../types';

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

  const roundsCompleted = currentProgress.roundsCompleted + 1;
  const verbsPracticed = currentProgress.verbsPracticed + roundResults.length;
  const fullyCorrect = currentProgress.fullyCorrect + roundCorrect;
  const answerAccuracy = verbsPracticed === 0 ? 0 : Math.round((fullyCorrect / verbsPracticed) * 100);

  return {
    roundsCompleted,
    verbsPracticed,
    fullyCorrect,
    answerAccuracy,
    bestRoundScore: Math.max(currentProgress.bestRoundScore, roundCorrect),
  };
}

interface UseVerbsPracticeParams {
  progress: LearningProgress;
  onProgressChange: (progress: LearningProgress) => void;
}

export function useVerbsPractice({ progress, onProgressChange }: UseVerbsPracticeParams) {
  const [queue, setQueue] = useState<Verb[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [initialRoundVerbs, setInitialRoundVerbs] = useState<Verb[]>([]);

  const start = (selectedVerbs: Verb[]) => {
    setInitialRoundVerbs(selectedVerbs);
    setQueue(shuffleItems(selectedVerbs));
    setResults([]);
  };

  const restart = () => {
    start(initialRoundVerbs);
  };

  const submitCard = (result: RoundResult) => {
    const updatedResults = [...results, result];
    setResults(updatedResults);

    const nextQueue = queue.slice(1);
    setQueue(nextQueue);

    const isFinished = nextQueue.length === 0;
    if (isFinished) {
      onProgressChange(calculateUpdatedProgress(progress, updatedResults));
    }

    return isFinished;
  };

  const clear = () => {
    setQueue([]);
    setResults([]);
  };

  return {
    queue,
    results,
    start,
    restart,
    submitCard,
    clear,
  };
}
