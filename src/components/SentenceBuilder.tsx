import { useMemo, useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import SentenceExerciseCard from './SentenceExerciseCard';
import { sentenceBuilderVerbs, selfLatenPairs, SentenceVerb } from '../data/sentenceBuilder';

type BuilderSection = 'learn' | 'practice' | 'test';

type ExerciseMode =
  | 'normalSentence'
  | 'questionBuilder'
  | 'perfectum'
  | 'imperfectum'
  | 'zelfLaten'
  | 'fixSentence';

interface TestExercise {
  id: string;
  mode: ExerciseMode;
  modeLabel: string;
  promptLines: string[];
  expected: string;
  hint?: string;
}

interface PracticeTask {
  id: string;
  title: string;
  instruction: string;
  words: string[];
  correctWords: string[];
  hint: string;
  focus: string;
}

const TOTAL_TEST_EXERCISES = 10;

const modes: ExerciseMode[] = [
  'normalSentence',
  'questionBuilder',
  'perfectum',
  'imperfectum',
  'zelfLaten',
  'fixSentence',
];

const subjects = [
  { pronoun: 'Ik', type: 'ik' as const },
  { pronoun: 'Jij', type: 'jij' as const },
  { pronoun: 'Wij', type: 'plural' as const },
  { pronoun: 'Zij', type: 'plural' as const },
];

const extraWords = ['vandaag', 'elke dag', 'thuis', 'op kantoor', 'in Amsterdam'];
const pastMarkers = ['gisteren', 'vroeger', 'toen'];

const practiceTasks: PracticeTask[] = [
  {
    id: 'practice-1',
    title: 'Build a sentence',
    instruction: 'Arrange words into a correct sentence.',
    words: ['gisteren', 'ik', 'gewerkt', 'heb'],
    correctWords: ['Ik', 'heb', 'gisteren', 'gewerkt'],
    hint: 'Subject + heb/ben + rest + participle',
    focus: 'Perfectum',
  },
  {
    id: 'practice-2',
    title: 'Build a sentence',
    instruction: 'Arrange words into a correct sentence.',
    words: ['vandaag', 'werk', 'ik'],
    correctWords: ['Vandaag', 'werk', 'ik'],
    hint: 'If time comes first: Time + Verb + Subject',
    focus: 'Verb second position (V2)',
  },
  {
    id: 'practice-3',
    title: 'Build a question',
    instruction: 'Arrange words into a correct question sentence.',
    words: ['jij', 'gewerkt', 'heb', 'al'],
    correctWords: ['Heb', 'jij', 'al', 'gewerkt'],
    hint: 'Question: Verb + Subject + Rest',
    focus: 'Question inversion',
  },
  {
    id: 'practice-4',
    title: 'Build a sentence',
    instruction: 'Arrange words into a correct sentence.',
    words: ['mijn', 'ik', 'wassen', 'auto', 'laat'],
    correctWords: ['Ik', 'laat', 'mijn', 'auto', 'wassen'],
    hint: 'Subject + laten + object + infinitive',
    focus: 'Laten construction',
  },
  {
    id: 'practice-5',
    title: 'Fix order',
    instruction: 'Arrange words into a correct sentence.',
    words: ['thuis', 'ik', 'werk', 'vandaag'],
    correctWords: ['Vandaag', 'werk', 'ik', 'thuis'],
    hint: 'Time first → finite verb in position 2',
    focus: 'Word order',
  },
  {
    id: 'practice-6',
    title: 'Build a sentence',
    instruction: 'Arrange words into a correct sentence.',
    words: ['ik', 'vroeger', 'trainde'],
    correctWords: ['Ik', 'trainde', 'vroeger'],
    hint: 'Subject + imperfectum + rest',
    focus: 'Imperfectum',
  },
];

function randomOf<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleItems<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
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

function buildTestExercise(mode: ExerciseMode): TestExercise {
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
      hint: 'Subject + Verb + Rest',
    };
  }

  if (mode === 'questionBuilder') {
    return {
      id,
      mode,
      modeLabel: 'Mode 2 · Question builder',
      promptLines: [`Verb: ${verb.infinitive}`, 'Goal: Ask if someone already did it.'],
      expected: `Heb jij al ${verb.perfectum}?`,
      hint: 'Verb + Subject + Rest',
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
      hint: 'Subject + heb/ben + participle',
    };
  }

  if (mode === 'imperfectum') {
    const marker = randomOf(pastMarkers);
    return {
      id,
      mode,
      modeLabel: 'Mode 4 · Imperfectum practice',
      promptLines: [`Infinitive: ${verb.infinitive}`, `Use marker: ${marker}`],
      expected: `Ik ${verb.imperfectum} ${marker}.`,
      hint: 'Subject + imperfectum + rest',
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
      hint: 'Subject + laten + object + infinitive',
    };
  }

  const subject = randomOf(subjects);
  const extra = randomOf(extraWords);
  const verbForm = buildPresentForm(verb, subject.type);
  const broken = `${extra} ${subject.pronoun.toLowerCase()} ${verbForm}.`;

  return {
    id,
    mode,
    modeLabel: 'Mode 6 · Fix the sentence',
    promptLines: [`Fix this sentence: "${capitalize(broken)}"`],
    expected: `${capitalize(extra)} ${verbForm} ${subject.pronoun.toLowerCase()}.`,
    hint: 'If time is first, finite verb is second',
  };
}

function buildTestRound(total: number): TestExercise[] {
  const base = modes.map((mode) => buildTestExercise(mode));
  const extraCount = Math.max(total - base.length, 0);
  const extra = Array.from({ length: extraCount }, () => buildTestExercise(randomOf(modes)));
  return shuffleItems([...base, ...extra]);
}

function buildPracticeRound(total: number): PracticeTask[] {
  const shuffled = shuffleItems(practiceTasks);
  if (total <= shuffled.length) {
    return shuffled.slice(0, total);
  }

  const extra = Array.from({ length: total - shuffled.length }, () => randomOf(practiceTasks));
  return [...shuffled, ...extra];
}

interface SentenceBuilderProps {
  onBack: () => void;
}

export default function SentenceBuilder({ onBack }: SentenceBuilderProps) {
  const [section, setSection] = useState<BuilderSection>('learn');

  const [testExercises, setTestExercises] = useState<TestExercise[]>(() => buildTestRound(TOTAL_TEST_EXERCISES));
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswer, setTestAnswer] = useState('');
  const [testFeedback, setTestFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [testScore, setTestScore] = useState(0);
  const [testStreak, setTestStreak] = useState(0);
  const [testBestStreak, setTestBestStreak] = useState(0);

  const [practiceRound, setPracticeRound] = useState<PracticeTask[]>(() => buildPracticeRound(6));
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [placedWords, setPlacedWords] = useState<(string | null)[]>(() =>
    Array.from({ length: practiceRound[0]?.correctWords.length ?? 0 }, () => null),
  );
  const [poolWords, setPoolWords] = useState<string[]>(() => practiceRound[0]?.words ?? []);
  const [practiceFeedback, setPracticeFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);

  const currentTest = testExercises[testIndex];
  const isTestFinished = testIndex >= testExercises.length;
  const testProgress = useMemo(
    () => Math.round((testIndex / testExercises.length) * 100),
    [testExercises.length, testIndex],
  );

  const currentPractice = practiceRound[practiceIndex];
  const isPracticeFinished = practiceIndex >= practiceRound.length;
  const practiceProgress = useMemo(
    () => Math.round((practiceIndex / practiceRound.length) * 100),
    [practiceIndex, practiceRound.length],
  );

  const resetPracticeBoard = (task: PracticeTask) => {
    setPlacedWords(Array.from({ length: task.correctWords.length }, () => null));
    setPoolWords(shuffleItems(task.words));
    setPracticeFeedback('idle');
    setShowHint(false);
  };

  const handleTestCheck = () => {
    if (!currentTest || !testAnswer.trim()) return;

    const isCorrect = normalizeSentence(testAnswer) === normalizeSentence(currentTest.expected);

    if (isCorrect) {
      setTestFeedback('correct');
      setTestScore((prev) => prev + 1);
      setTestStreak((prev) => {
        const nextStreak = prev + 1;
        setTestBestStreak((best) => Math.max(best, nextStreak));
        return nextStreak;
      });
      return;
    }

    setTestFeedback('incorrect');
    setTestStreak(0);
  };

  const handleTestNext = () => {
    setTestIndex((prev) => prev + 1);
    setTestAnswer('');
    setTestFeedback('idle');
  };

  const restartTest = () => {
    setTestExercises(buildTestRound(TOTAL_TEST_EXERCISES));
    setTestIndex(0);
    setTestAnswer('');
    setTestFeedback('idle');
    setTestScore(0);
    setTestStreak(0);
    setTestBestStreak(0);
  };

  const restartPractice = () => {
    const newRound = buildPracticeRound(6);
    setPracticeRound(newRound);
    setPracticeIndex(0);
    resetPracticeBoard(newRound[0]);
  };

  const checkPractice = () => {
    if (!currentPractice) return;
    if (placedWords.some((word) => !word)) return;

    const candidate = placedWords.join(' ');
    const expected = currentPractice.correctWords.join(' ');
    setPracticeFeedback(normalizeSentence(candidate) === normalizeSentence(expected) ? 'correct' : 'incorrect');
  };

  const nextPractice = () => {
    const nextIndex = practiceIndex + 1;
    setPracticeIndex(nextIndex);

    if (nextIndex >= practiceRound.length) {
      return;
    }

    resetPracticeBoard(practiceRound[nextIndex]);
  };

  const onDropWord = (slotIndex: number, value: string) => {
    setPracticeFeedback('idle');

    setPlacedWords((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex((item) => item === value);
      if (existingIndex >= 0) {
        updated[existingIndex] = null;
      }

      const replacedValue = updated[slotIndex];
      updated[slotIndex] = value;

      setPoolWords((poolPrev) => {
        let nextPool = poolPrev.filter((word) => word !== value);
        if (replacedValue) {
          nextPool = [...nextPool, replacedValue];
        }
        return nextPool;
      });

      return updated;
    });
  };

  const returnWordToPool = (value: string) => {
    setPracticeFeedback('idle');
    setPlacedWords((prev) => prev.map((word) => (word === value ? null : word)));
    setPoolWords((prev) => [...prev, value]);
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="rounded-2xl border border-white/50 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-2">
          <TabButton active={section === 'learn'} onClick={() => setSection('learn')} label="Learn" />
          <TabButton active={section === 'practice'} onClick={() => setSection('practice')} label="Practice" />
          <TabButton active={section === 'test'} onClick={() => setSection('test')} label="Test" />
        </div>
      </div>

      {section === 'learn' && <GrammarGuide />}

      {section === 'practice' && (
        <div className="space-y-4">
          {isPracticeFinished ? (
            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl">
              <h3 className="text-2xl font-semibold text-stone-900">Practice complete</h3>
              <p className="mt-2 text-stone-600">Great! Repeat to automate Dutch sentence patterns.</p>
              <div className="mt-4 flex gap-3">
                <button onClick={restartPractice} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Restart Practice</button>
                <button onClick={onBack} className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50">Back to menu</button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between text-sm text-stone-600">
                  <p>Practice {practiceIndex + 1} / {practiceRound.length}</p>
                  <p className="font-medium text-violet-700">Focus: {currentPractice.focus}</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                  <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${practiceProgress}%` }} />
                </div>
              </div>

              <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-xl">
                <p className="mb-1 text-xs uppercase tracking-wide text-violet-700">{currentPractice.title}</p>
                <p className="text-stone-700">{currentPractice.instruction}</p>

                <div className="mt-5 space-y-3">
                  <p className="text-sm font-medium text-stone-600">Sentence slots</p>
                  <div className="flex flex-wrap gap-2">
                    {placedWords.map((word, slotIndex) => (
                      <div
                        key={`${currentPractice.id}-slot-${slotIndex}`}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          const value = event.dataTransfer.getData('text/plain');
                          if (!value) return;
                          onDropWord(slotIndex, value);
                        }}
                        className="min-h-11 min-w-[120px] rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-center text-sm text-stone-500"
                      >
                        {word ? (
                          <button
                            draggable
                            type="button"
                            onDragStart={(event) => event.dataTransfer.setData('text/plain', word)}
                            onDoubleClick={() => returnWordToPool(word)}
                            className="rounded-lg bg-indigo-100 px-2.5 py-1 text-sm font-medium text-indigo-800"
                          >
                            {word}
                          </button>
                        ) : (
                          <span>drop word</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-sm font-medium text-stone-600">Word bank (drag words)</p>
                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const value = event.dataTransfer.getData('text/plain');
                      if (!value) return;
                      returnWordToPool(value);
                    }}
                    className="flex min-h-14 flex-wrap gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3"
                  >
                    {poolWords.map((word, idx) => (
                      <button
                        key={`${currentPractice.id}-pool-${word}-${idx}`}
                        draggable
                        type="button"
                        onDragStart={(event) => event.dataTransfer.setData('text/plain', word)}
                        className="rounded-lg bg-white px-2.5 py-1 text-sm font-medium text-stone-700 shadow-sm"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {showHint && (
                  <p className="mt-4 inline-flex items-center gap-1 text-sm text-violet-700">
                    <Lightbulb className="h-4 w-4" />
                    {currentPractice.hint}
                  </p>
                )}

                {practiceFeedback === 'correct' && <p className="mt-4 text-sm font-medium text-emerald-600">Correct! Great sentence pattern.</p>}
                {practiceFeedback === 'incorrect' && <p className="mt-4 text-sm font-medium text-rose-600">Try again. Check verb position and tense pattern.</p>}

                <div className="mt-6 flex flex-wrap gap-2">
                  <button onClick={practiceFeedback === 'correct' ? nextPractice : checkPractice} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
                    {practiceFeedback === 'correct' ? 'Next task' : 'Check order'}
                  </button>
                  <button onClick={() => setShowHint((prev) => !prev)} className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    {showHint ? 'Hide hint' : 'Hint'}
                  </button>
                  <button onClick={() => currentPractice && resetPracticeBoard(currentPractice)} className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {section === 'test' && (
        <div className="space-y-4">
          {isTestFinished ? (
            <section className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl">
              <h2 className="text-2xl font-semibold text-stone-900">Test complete</h2>
              <p className="text-stone-600">Now go back to Learn/Practice and repeat patterns daily.</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Metric title="Score" value={`${testScore}/${testExercises.length}`} />
                <Metric title="Accuracy" value={`${Math.round((testScore / testExercises.length) * 100)}%`} />
                <Metric title="Best streak" value={String(testBestStreak)} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={restartTest} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Restart Test</button>
                <button onClick={onBack} className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Back to menu</button>
              </div>
            </section>
          ) : (
            <>
              <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between text-sm text-stone-600">
                  <p>Test {testIndex + 1} / {testExercises.length}</p>
                  <p>
                    Score: <span className="font-semibold text-indigo-700">{testScore}</span> · Streak:{' '}
                    <span className="font-semibold text-emerald-600">{testStreak}</span>
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                  <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${testProgress}%` }} />
                </div>
              </div>

              {currentTest && (
                <SentenceExerciseCard
                  modeLabel={currentTest.modeLabel}
                  promptLines={currentTest.promptLines}
                  hint={currentTest.hint}
                  userAnswer={testAnswer}
                  feedback={testFeedback}
                  onAnswerChange={setTestAnswer}
                  onCheck={handleTestCheck}
                  onNext={handleTestNext}
                />
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active ? 'bg-white text-indigo-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
      }`}
    >
      {label}
    </button>
  );
}

function GrammarGuide() {
  return (
    <div className="space-y-4">
      <GuideCard
        title="Word Order"
        pattern="Subject + Verb + Rest"
        examples={['Ik werk vandaag.', 'Vandaag werk ik thuis.']}
      />
      <GuideCard
        title="Perfectum"
        pattern="Subject + heb/ben + participle"
        examples={['Ik heb gewerkt.', 'Ik ben gegaan.']}
      />
      <GuideCard
        title="Question Structure"
        pattern="Verb + Subject + Rest"
        examples={['Werk jij vandaag?', 'Heb jij gewerkt?']}
      />
      <GuideCard
        title="Laten Construction"
        pattern="Subject + laten + object + infinitive"
        examples={['Ik laat mijn auto wassen.']}
      />
    </div>
  );
}

function GuideCard({ title, pattern, examples }: { title: string; pattern: string; examples: string[] }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl">
      <p className="text-xs uppercase tracking-wide text-emerald-700">Grammar Guide</p>
      <h3 className="mt-1 text-xl font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">{pattern}</p>
      <ul className="mt-3 space-y-1 text-stone-700">
        {examples.map((example) => (
          <li key={example}>• {example}</li>
        ))}
      </ul>
    </div>
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
