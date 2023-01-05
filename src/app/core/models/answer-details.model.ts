import { Question } from './question.model';

export interface AnswerDetails {
    id: number | string;
    valid: boolean;
    value: any;
    question: Question;
    statement?: string;
}
