import { CheckCircle2, CircleAlert, Lightbulb } from 'lucide-react';

interface SentenceExerciseCardProps {
  modeLabel: string;
  promptLines: string[];
  userAnswer: string;
  feedback: 'idle' | 'correct' | 'incorrect';
  hint?: string;
  onAnswerChange: (value: string) => void;
  onCheck: () => void;
  onNext: () => void;
}

export default function SentenceExerciseCard({
  modeLabel,
  promptLines,
  userAnswer,
  feedback,
  hint,
  onAnswerChange,
  onCheck,
  onNext,
}: SentenceExerciseCardProps) {
  return (
    <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl sm:p-8">
      <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
        {modeLabel}
      </p>

      <div className="mb-5 space-y-2 rounded-2xl bg-stone-50 p-4 text-stone-700">
        {promptLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <label className="mb-2 block text-sm font-medium text-stone-600">Ваша відповідь</label>
      <input
        value={userAnswer}
        onChange={(event) => onAnswerChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (feedback === 'correct') {
              onNext();
              return;
            }
            onCheck();
          }
        }}
        placeholder="Напишіть правильне речення нідерландською"
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />

      {hint && (
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-stone-500">
          <Lightbulb className="h-3.5 w-3.5" />
          {hint}
        </p>
      )}

      {feedback === 'correct' && (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Correct! Гарна структура.
        </p>
      )}

      {feedback === 'incorrect' && (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-600">
          <CircleAlert className="h-4 w-4" />
          Try again. Перевір порядок слів і форму дієслова.
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={feedback === 'correct' ? onNext : onCheck}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {feedback === 'correct' ? 'Next Exercise' : 'Check'}
        </button>
      </div>
    </div>
  );
}
