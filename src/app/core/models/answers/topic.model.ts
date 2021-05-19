
export interface Topic {
    id: number;
    topic_name: string;
    complete: boolean;
    total_questions_count: number;
    answered_questions_count: number;
    correct_answers_percentage: number;
    start_date: Date;
    end_date: Date;
}