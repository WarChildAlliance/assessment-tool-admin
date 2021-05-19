
export interface Question {
    id: number;
    title: string;
    order: number;
    question_type: string;
    has_attachment: boolean;
    attachment_icon: string;
    correct_answers_percentage: number;
}