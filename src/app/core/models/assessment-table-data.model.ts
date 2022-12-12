
export interface AssessmentTableData {
    id: number;
    title: string;
    subject: string;
    last_session: Date;
    accessible_question_sets_count: number;
    completed_question_sets_count: number;
}
