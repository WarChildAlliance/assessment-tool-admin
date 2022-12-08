
export interface QuestionSetTableData {
    id: number;
    name: string;
    questions_count: number;
    student_tries_count: number;
    correct_answers_percentage_first_try: number;
    correct_answers_percentage_last_try: number;
    last_submission: Date;
}
