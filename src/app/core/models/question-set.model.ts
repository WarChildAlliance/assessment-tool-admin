import { Assessment } from './assessment.model';
import { Question } from './question.model';
import { LearningObjective } from './learning-objective.model';

export interface QuestionSet {
    id: number;
    name: string;
    learning_objective: LearningObjective;
    order: number;
    assessment: Assessment;
    questions?: Question[];
    score: number;
}
