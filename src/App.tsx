/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Verb } from './data/verbs';
import { RoundResult } from './types';
import Flashcard from './components/Flashcard';
import Menu from './components/Menu';
import Summary from './components/Summary';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'summary'>('menu');
  const [gameQueue, setGameQueue] = useState<Verb[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [initialRoundVerbs, setInitialRoundVerbs] = useState<Verb[]>([]);

  const handleStart = (selectedVerbs: Verb[]) => {
    // Shuffle the selected verbs
    const shuffled = [...selectedVerbs].sort(() => Math.random() - 0.5);
    setInitialRoundVerbs(selectedVerbs); // Store original selection for restart
    setGameQueue(shuffled);
    setResults([]);
    setGameState('playing');
  };

  const handleRestart = () => {
    handleStart(initialRoundVerbs);
  };

  const handleCardResult = (result: RoundResult) => {
    setResults(prev => [...prev, result]);
    
    // Remove the current verb from the queue (it's always the first one)
    const newQueue = gameQueue.slice(1);
    setGameQueue(newQueue);

    if (newQueue.length === 0) {
      setGameState('summary');
    }
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setGameQueue([]);
    setResults([]);
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
        <h1 className="text-3xl font-serif font-medium tracking-tight text-stone-900">
          Dutch Irregular Verbs
        </h1>
        {gameState === 'menu' && (
          <p className="text-stone-500 max-w-md mx-auto">
            Practice your Imperfectum and Perfectum forms.
          </p>
        )}
      </header>

      <main className="w-full max-w-2xl">
        {gameState === 'menu' && (
          <Menu onStart={handleStart} />
        )}

        {gameState === 'playing' && currentVerb && (
          <Flashcard 
            verb={currentVerb}
            currentIndex={currentIndex}
            totalCount={totalRoundCount}
            onNext={handleCardResult} 
          />
        )}

        {gameState === 'summary' && (
          <Summary 
            results={results} 
            onRestart={handleRestart} 
            onHome={handleBackToMenu} 
          />
        )}
      </main>

      <footer className="mt-auto pt-12 text-center text-stone-400 text-sm">
        {gameState === 'menu' ? (
          <p>Ready to practice?</p>
        ) : (
          <p>
            {gameState === 'playing' ? 'Keep going!' : 'Well done!'}
          </p>
        )}
      </footer>
    </div>
  );
}

