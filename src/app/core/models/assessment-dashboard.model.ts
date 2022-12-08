
export interface AssessmentDashboard {
    id: string;
    title: string;
    evaluated: boolean;
    question_sets: [{
        id: string;
        name: string;
        average: number;
    }];
    started: boolean;
}
