import { Group } from './group.model';

export interface StudentTableData {
    id: number;
    username: string;
    full_name: string;
    first_name: string;
    last_name: string;
    assessments_count: number;
    completed_question_sets_count: number;
    language_name: string;
    language_code: string;
    country_name: string;
    country_code: string;
    last_session: Date;
    is_active: boolean;
    active_status_updated_on: Date;
    can_delete: boolean;
    grade: string;
    group: Group;
}
