import { Assessment } from './assessment.model';

export interface Topic {
    id: number;
    name: string;
    order: number;
    assessment: Assessment;
}
