
export interface Question {
    id: number;
    title: string;
    order: number;
    question_type: string;
    has_attachment: boolean;
    attachment_icon: string;
    correct_answer_percentage: number;
}