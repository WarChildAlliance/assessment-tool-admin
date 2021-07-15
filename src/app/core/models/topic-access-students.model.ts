
export interface TopicAccessStudents {
    id: string;
    student: {
        id: string,
        full_name: string
    };
    topic_first_try: AssessmentTopicAnswer;
}

export interface AssessmentTopicAnswer {
    complete: boolean;
    id: string;
    session_id: string;
    topic_access_id: string;
    start_date: Date;
    end_date: Date;
}
