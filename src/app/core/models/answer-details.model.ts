import { Question } from './question.model';

export interface AnswerDetails {
    valid: boolean;
    value: any;
    question: Question;
}
