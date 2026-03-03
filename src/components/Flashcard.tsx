import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Verb } from '../data/verbs';
import { RoundResult, AnswerStatus } from '../types';
import { RefreshCw, Check, RotateCcw, X, AlertCircle } from 'lucide-react';

interface FlashcardProps {
  verb: Verb;
  currentIndex: number;
  totalCount: number;
  onNext: (result: RoundResult) => void;
}

interface AnswerCheckResult {
  status: AnswerStatus;
  message?: string;
}

export default function Flashcard({ verb, currentIndex, totalCount, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imperfectInput, setImperfectInput] = useState('');
  const [perfectInput, setPerfectInput] = useState('');

  // Reset state when verb changes
  useEffect(() => {
    setIsFlipped(false);
    setImperfectInput('');
    setPerfectInput('');
  }, [verb]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const normalize = (text: string) => text.toLowerCase().replace(/[()]/g, '').trim();
  
  // Create a "skeleton" of the word by removing consecutive duplicate characters
  const getSkeleton = (text: string) => text.replace(/(.)\1+/g, '$1');

  const checkAnswer = (input: string, correct: string): AnswerCheckResult => {
    if (!input.trim()) return { status: 'incorrect' };
    
    const userClean = normalize(input);
    const correctClean = normalize(correct);
    
    // Split by slash for multiple correct forms
    const options = correctClean.split('/').map(s => s.trim());
    
    // 1. Check for exact match
    const isCorrect = options.some(opt => {
      return opt === userClean || (opt.includes(' ') && opt.endsWith(userClean));
    });

    if (isCorrect) return { status: 'correct' };

    // 2. Check for double letter errors
    const userSkeleton = getSkeleton(userClean);
    const isDoubleLetterError = options.some(opt => {
       if (getSkeleton(opt) === userSkeleton) return true;
       if (opt.includes(' ')) {
           const participle = opt.split(' ').pop() || '';
           if (getSkeleton(participle) === userSkeleton) return true;
       }
       return false;
    });

    if (isDoubleLetterError) {
      return { 
        status: 'warning', 
        message: 'Check double/single letters!' 
      };
    }

    return { status: 'incorrect' };
  };

  const imperfectResult = checkAnswer(imperfectInput, verb.imperfect);
  const perfectResult = checkAnswer(perfectInput, verb.perfect);

  const handleNext = () => {
    onNext({
      verb,
      imperfectStatus: imperfectResult.status,
      perfectStatus: perfectResult.status,
      userImperfect: imperfectInput,
      userPerfect: perfectInput
    });
  };

  const getStatusColor = (status: AnswerStatus) => {
    switch (status) {
      case 'correct': return 'text-green-300';
      case 'warning': return 'text-orange-300';
      case 'incorrect': return 'text-red-300';
    }
  };

  const getStatusIcon = (status: AnswerStatus) => {
    switch (status) {
      case 'correct': return <Check className="w-4 h-4 text-green-300" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-300" />;
      case 'incorrect': return <X className="w-4 h-4 text-red-300" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div className="mb-4 flex justify-between items-center text-sm font-medium text-stone-500">
        <span>Word {currentIndex} of {totalCount}</span>
        <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(currentIndex / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative w-full h-[500px]" style={{ perspective: '1000px' }}>
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) {
              return;
            }
            handleFlip();
          }}
        >
          {/* Front of Card */}
          <div 
            className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-stone-200 p-8 flex flex-col items-center justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full flex justify-between items-center text-stone-400">
              <span className="text-xs font-mono uppercase tracking-wider">Nederlands</span>
              <span className="text-xs font-mono uppercase tracking-wider">Infinitive</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
              <div className="text-center">
                <h2 className="text-5xl font-serif font-medium text-stone-800 mb-2">
                  {verb.infinitive}
                </h2>
                <p className="text-stone-500 text-sm font-medium">
                  {verb.translation}
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide ml-1">
                    Imperfectum
                  </label>
                  <input
                    type="text"
                    value={imperfectInput}
                    onChange={(e) => setImperfectInput(e.target.value)}
                    placeholder="deed / deden"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wide ml-1">
                    Perfectum
                  </label>
                  <input
                    type="text"
                    value={perfectInput}
                    onChange={(e) => setPerfectInput(e.target.value)}
                    placeholder="(hebben) gedaan"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center pt-4">
              <button
                onClick={handleFlip}
                className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                Check Answer
              </button>
            </div>
          </div>

          {/* Back of Card */}
          <div 
            className="absolute w-full h-full backface-hidden bg-indigo-600 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-between text-white"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-full flex justify-between items-center text-indigo-200">
              <span className="text-xs font-mono uppercase tracking-wider">Results</span>
              <RotateCcw className="w-4 h-4" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full gap-6 text-center">
              <div>
                <h3 className="text-sm font-medium text-indigo-200 uppercase tracking-wide mb-1">Infinitive</h3>
                <p className="text-3xl font-serif">{verb.infinitive}</p>
              </div>

              <div className="w-full h-px bg-indigo-500/50" />

              <div className="w-full grid grid-cols-1 gap-4">
                <div className="bg-indigo-700/50 rounded-xl p-3">
                  <h3 className="text-xs font-medium text-indigo-200 uppercase tracking-wide mb-2">Imperfectum</h3>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`font-bold ${getStatusColor(imperfectResult.status)} ${imperfectResult.status === 'incorrect' ? 'line-through' : ''}`}>
                      {imperfectInput || "—"}
                    </span>
                    {getStatusIcon(imperfectResult.status)}
                  </div>
                  {imperfectResult.status === 'warning' && (
                    <p className="text-xs text-orange-200 font-medium mb-1">{imperfectResult.message}</p>
                  )}
                  {imperfectResult.status !== 'correct' && (
                     <p className="text-lg font-medium text-white">{verb.imperfect}</p>
                  )}
                  {imperfectResult.status === 'correct' && (
                     <p className="text-xs text-indigo-300 mt-1">{verb.imperfect}</p>
                  )}
                </div>

                <div className="bg-indigo-700/50 rounded-xl p-3">
                  <h3 className="text-xs font-medium text-indigo-200 uppercase tracking-wide mb-2">Perfectum</h3>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`font-bold ${getStatusColor(perfectResult.status)} ${perfectResult.status === 'incorrect' ? 'line-through' : ''}`}>
                      {perfectInput || "—"}
                    </span>
                    {getStatusIcon(perfectResult.status)}
                  </div>
                  {perfectResult.status === 'warning' && (
                    <p className="text-xs text-orange-200 font-medium mb-1">{perfectResult.message}</p>
                  )}
                  {perfectResult.status !== 'correct' && (
                     <p className="text-lg font-medium text-white">{verb.perfect}</p>
                  )}
                  {perfectResult.status === 'correct' && (
                     <p className="text-xs text-indigo-300 mt-1">{verb.perfect}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center pt-4 gap-3">
              <button
                onClick={handleFlip}
                className="px-6 py-2 bg-indigo-800 text-white rounded-full hover:bg-indigo-900 transition-colors text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
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
