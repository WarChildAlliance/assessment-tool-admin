import { Assessment } from './assessment.model';

export interface Topic {
    name: string;
    order: number;
    assessment: Assessment;
}
