
export interface Session {
    id: number;
    start_date: Date;
    end_date: Date;
    completed_topics_count: number;
    answered_questions_count: number;
    correctly_answered_questions_count: number;
    correct_answers_percentage: number;
}