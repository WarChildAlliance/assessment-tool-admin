
export interface BatchQuestionSetAccesses {
    students: number[];
    accesses: {
        question_set: number;
        start_date: string;
        end_date: string;
    }[];
}
