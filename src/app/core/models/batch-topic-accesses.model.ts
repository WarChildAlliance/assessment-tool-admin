
export interface BatchTopicAccesses {
    students: number[];
    accesses: {
        topic: number;
        start_date: string;
        end_date: string;
    }[];
}
