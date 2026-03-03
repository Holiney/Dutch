import { useState } from 'react';
import { starterWords, WordCard } from '../data/words';
import { WordRoundResult } from '../types';

function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useWordsPractice() {
  const [queue, setQueue] = useState<WordCard[]>([]);
  const [results, setResults] = useState<WordRoundResult[]>([]);

  const start = () => {
    setQueue(shuffleItems(starterWords));
    setResults([]);
  };

  const submitCard = (result: WordRoundResult) => {
    setResults((prev) => [...prev, result]);
    const nextQueue = queue.slice(1);
    setQueue(nextQueue);
    return nextQueue.length === 0;
  };

  const clear = () => {
    setQueue([]);
    setResults([]);
  };

  return {
    queue,
    results,
    start,
    submitCard,
    clear,
  };
}
