import { Assessment } from './assessment.model';
import { Question } from './question.model';

export interface Topic {
    id: number;
    name: string;
    order: number;
    assessment: Assessment;
    questions?: Question[];
    score: number;
}
