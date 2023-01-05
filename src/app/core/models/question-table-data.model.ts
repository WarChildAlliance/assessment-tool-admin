
export interface QuestionTableData {
    id: number;
    title: string;
    order: number;
    question_type: string;
    has_attachment: boolean;
    topic?: string;
    student_speed?: any;
    grade?: string;
    created_at?: Date;
    invites?: number;
    plays?: number;
    subtopic?: any;
    subject?: string;
    score?: number;
    learning_objective?: any;
    // correct_answers_percentage_first: number;
    // correct_answers_percentage_last: number;
}
