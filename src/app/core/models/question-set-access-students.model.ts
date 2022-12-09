
export interface QuestionSetAccessStudents {
    id: string;
    student: {
        id: string;
        full_name: string;
    };
    question_set_first_try: AssessmentQuestionSetAnswer;
}

export interface AssessmentQuestionSetAnswer {
    complete: boolean;
    id: string;
    session_id: string;
    question_set_access_id: string;
    start_date: Date;
    end_date: Date;
}
