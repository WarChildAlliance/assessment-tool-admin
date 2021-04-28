
export interface BatchTopicAccesses {
    students: {
        student_id: number
    }[];
    accesses: {
        topic_id: number,
        start_date: Date,
        end_date: Date
    }[];
}
