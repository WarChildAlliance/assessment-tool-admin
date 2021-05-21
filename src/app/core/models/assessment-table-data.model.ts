
export interface AssessmentTableData {
    id: number;
    title: string;
    subject: string;
    last_session: Date;
    accessible_topics_count: number;
    completed_topics_count: number;
    first_session_correct_answers_percentage: number;
    last_session_correct_answers_percentage: number;
}
