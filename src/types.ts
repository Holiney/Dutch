import { Verb } from './data/verbs';
import { WordCard } from './data/words';

export type AnswerStatus = 'correct' | 'warning' | 'incorrect';
export type WordsMode = 'study' | 'quizUkToNl' | 'quizNlToUk';

export interface RoundResult {
  verb: Verb;
  imperfectStatus: AnswerStatus;
  perfectStatus: AnswerStatus;
  userImperfect: string;
  userPerfect: string;
}

export interface WordRoundResult {
  word: WordCard;
  userAnswer: string;
  expectedAnswer: string;
  promptText: string;
  status: 'correct' | 'incorrect';
}

export interface LearningProgress {
  roundsCompleted: number;
  verbsPracticed: number;
  fullyCorrect: number;
  answerAccuracy: number;
  bestRoundScore: number;
}
