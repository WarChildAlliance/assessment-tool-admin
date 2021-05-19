export interface Student {
    id: number;
    full_name: string;
    assessments_count: number;
    completed_topics_count: number;
    language_name: string;
    language_code: string;
    country_name: string;
    country_code: string;
    last_session: Date;
}