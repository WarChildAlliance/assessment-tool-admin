import { AnswerDetails } from './answer-details.model';
import { QuestionSet } from './question-set.model';

export interface AssessmentTableData {
    id: number;
    title: string;
    subject: string;
    last_session: Date;
    accessible_question_sets_count: number;
    completed_question_sets_count: number;
    answers?: AnswerDetails[];
    icon?: string;
    question_sets?: QuestionSet[];
}
