
export interface QuestionSetAnswer {
    id: string;
    question: {id: string; order: string; title: string};
    valid: boolean;
    color: string;
}
