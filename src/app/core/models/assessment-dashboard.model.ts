
export interface AssessmentDashboard {
    id: string;
    title: string;
    evaluated: boolean;
    topics: [{
        id: string,
        name: string,
        average: number
    }];
    started: boolean;
}
