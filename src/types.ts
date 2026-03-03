import { Verb } from './data/verbs';

export type AnswerStatus = 'correct' | 'warning' | 'incorrect';

export interface RoundResult {
  verb: Verb;
  imperfectStatus: AnswerStatus;
  perfectStatus: AnswerStatus;
  userImperfect: string;
  userPerfect: string;
}
