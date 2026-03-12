import { useMemo, useState } from 'react';
import SentenceExerciseCard from './SentenceExerciseCard';
import { sentenceBuilderVerbs, selfLatenPairs, SentenceVerb } from '../data/sentenceBuilder';

type ExerciseMode =
  | 'normalSentence'
  | 'questionBuilder'
  | 'perfectum'
  | 'imperfectum'
  | 'zelfLaten'
  | 'fixSentence';

interface Exercise {
  id: string;
  mode: ExerciseMode;
  modeLabel: string;
  promptLines: string[];
  expected: string;
  hint?: string;
}

const TOTAL_EXERCISES = 10;

const subjects = [
  { pronoun: 'Ik', type: 'ik' as const },
  { pronoun: 'Jij', type: 'jij' as const },
  { pronoun: 'Wij', type: 'plural' as const },
  { pronoun: 'Zij', type: 'plural' as const },
];

const extraWords = ['vandaag', 'elke dag', 'thuis', 'op kantoor', 'in Amsterdam'];
const pastMarkers = ['gisteren', 'vroeger', 'toen'];

function randomOf<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function capitalize(sentence: string): string {
  const clean = sentence.trim();
  if (!clean) return clean;
  return clean[0].toUpperCase() + clean.slice(1);
}

function normalizeSentence(sentence: string): string {
  return sentence
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s*([?.!])/g, '$1')
    .trim();
}

function buildPresentForm(verb: SentenceVerb, subjectType: 'ik' | 'jij' | 'plural'): string {
  const infinitive = verb.infinitive;

  if (infinitive.includes(' ')) {
    return infinitive;
  }

  const stem = infinitive.endsWith('en') ? infinitive.slice(0, -2) : infinitive;

  if (subjectType === 'ik') return stem;
  if (subjectType === 'plural') return infinitive;
  if (stem.endsWith('t')) return stem;
  return `${stem}t`;
}

function buildExercise(): Exercise {
  const mode = randomOf<ExerciseMode>([
    'normalSentence',
    'questionBuilder',
    'perfectum',
    'imperfectum',
    'zelfLaten',
    'fixSentence',
  ]);

  const verb = randomOf(sentenceBuilderVerbs);
  const id = `${mode}-${verb.infinitive}-${Math.random().toString(36).slice(2, 8)}`;

  if (mode === 'normalSentence') {
    const subject = randomOf(subjects);
    const extra = randomOf(extraWords);
    const verbForm = buildPresentForm(verb, subject.type);
    const expected = `${subject.pronoun} ${verbForm} ${extra}.`;

    return {
      id,
      mode,
      modeLabel: 'Mode 1 · Build a normal sentence',
      promptLines: [
        `Word: ${verb.infinitive}`,
        'Time: Present',
        `Subject: ${subject.pronoun.toLowerCase()}`,
        `Extra: ${extra}`,
      ],
      expected: capitalize(expected),
      hint: 'Тримай дієслово на 2-й позиції (V2).',
    };
  }

  if (mode === 'questionBuilder') {
    const expected = `Heb jij al ${verb.perfectum}?`;

    return {
      id,
      mode,
      modeLabel: 'Mode 2 · Question builder',
      promptLines: [`Verb: ${verb.infinitive}`, 'Goal: Ask if someone already did it.'],
      expected,
      hint: 'Perfectum question: Heb + subject + al + participle?',
    };
  }

  if (mode === 'perfectum') {
    const variant = randomOf([
      `Ik heb ${verb.perfectum}.`,
      `Heb jij ${verb.perfectum}?`,
      `Wij hebben ${verb.perfectum}.`,
    ]);

    return {
      id,
      mode,
      modeLabel: 'Mode 3 · Perfectum practice',
      promptLines: [`Infinitive: ${verb.infinitive}`, 'Build a sentence in perfectum.'],
      expected: variant,
      hint: 'Використай heb/hebt/hebben + participle.',
    };
  }

  if (mode === 'imperfectum') {
    const marker = randomOf(pastMarkers);
    const expected = `Ik ${verb.imperfectum} ${marker}.`;

    return {
      id,
      mode,
      modeLabel: 'Mode 4 · Imperfectum practice',
      promptLines: [`Infinitive: ${verb.infinitive}`, `Use marker: ${marker}`],
      expected,
      hint: 'Проста минула форма: ik + imperfectum.',
    };
  }

  if (mode === 'zelfLaten') {
    const pair = randomOf(selfLatenPairs);
    return {
      id,
      mode,
      modeLabel: 'Mode 5 · Zelf vs Laten',
      promptLines: [`Goal: ${pair.goal}`],
      expected: pair.correctSentence,
      hint: 'zelf = роблю сам(а), laten + infinitive = доручаю.',
    };
  }

  const subject = randomOf(subjects);
  const extra = randomOf(extraWords);
  const verbForm = buildPresentForm(verb, subject.type);
  const broken = `${extra} ${subject.pronoun.toLowerCase()} ${verbForm}.`;
  const fixed = `${capitalize(extra)} ${verbForm} ${subject.pronoun.toLowerCase()}.`;

  return {
    id,
    mode,
    modeLabel: 'Mode 6 · Fix the sentence',
    promptLines: [`Fix this sentence: "${capitalize(broken)}"`],
    expected: fixed,
    hint: 'Після обставини на початку — дієслово перед підметом.',
  };
}

function buildExerciseRound(total: number): Exercise[] {
  return Array.from({ length: total }, () => buildExercise());
}

interface SentenceBuilderProps {
  onBack: () => void;
}

export default function SentenceBuilder({ onBack }: SentenceBuilderProps) {
  const [exercises, setExercises] = useState<Exercise[]>(() => buildExerciseRound(TOTAL_EXERCISES));
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const currentExercise = exercises[index];

  const progress = useMemo(() => Math.round((index / exercises.length) * 100), [index, exercises.length]);
  const isFinished = index >= exercises.length;

  const handleCheck = () => {
    if (!currentExercise || !userAnswer.trim()) return;

    const isCorrect = normalizeSentence(userAnswer) === normalizeSentence(currentExercise.expected);

    if (isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const nextStreak = prev + 1;
        setBestStreak((currentBest) => Math.max(currentBest, nextStreak));
        return nextStreak;
      });
      return;
    }

    setFeedback('incorrect');
    setStreak(0);
  };

  const handleNext = () => {
    setIndex((prev) => prev + 1);
    setUserAnswer('');
    setFeedback('idle');
  };

  const handleRestart = () => {
    setExercises(buildExerciseRound(TOTAL_EXERCISES));
    setIndex(0);
    setUserAnswer('');
    setFeedback('idle');
    setScore(0);
    setStreak(0);
    setBestStreak(0);
  };

  if (isFinished) {
    return (
      <section className="mx-auto w-full max-w-3xl space-y-5 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-stone-900">Sentence Builder complete</h2>
        <p className="text-stone-600">Quick daily session finished. Keep repeating patterns for 1–5 minutes.</p>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric title="Score" value={`${score}/${exercises.length}`} />
          <Metric title="Accuracy" value={`${Math.round((score / exercises.length) * 100)}%`} />
          <Metric title="Best streak" value={String(bestStreak)} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleRestart} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Start new 5-min round</button>
          <button onClick={onBack} className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Back to menu</button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between text-sm text-stone-600">
          <p>Exercise {index + 1} / {exercises.length}</p>
          <p>Score: <span className="font-semibold text-indigo-700">{score}</span> · Streak: <span className="font-semibold text-emerald-600">{streak}</span></p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {currentExercise && (
        <SentenceExerciseCard
          modeLabel={currentExercise.modeLabel}
          promptLines={currentExercise.promptLines}
          hint={currentExercise.hint}
          userAnswer={userAnswer}
          feedback={feedback}
          onAnswerChange={setUserAnswer}
          onCheck={handleCheck}
          onNext={handleNext}
        />
      )}
    </section>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
      <p className="text-xs uppercase tracking-wide text-stone-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}
