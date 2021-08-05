
export interface QuestionTableData {
    id: number;
    title: string;
    order: number;
    question_type: string;
    has_attachment: boolean;
    correct_answers_percentage_first: number;
    correct_answers_percentage_last: number;
}
