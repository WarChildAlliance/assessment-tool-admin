import { AssessmentTableData } from './assessment-table-data.model';
import { Group } from './group.model';
import { TableActionButtons } from './table-actions-buttons.model';

export interface StudentTableData {
    id: number;
    username: string;
    full_name: string;
    first_name: string;
    last_name: string;
    assessments: AssessmentTableData;
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
    sel_overview: { average_statement: string; progress: number };
    average_score: number;
    honey: number;
}

export const StudentSubMenuTableData = [
    {
        action:  'openEditStudentDialog',
        icon: 'edit',
        name: 'general.edit',
        color: '#4AA0DB'
    },
    {
        action:  'deleteStudent',
        icon: 'delete',
        name: 'general.delete',
        color: '#FF5252'
    }
];

export const StudentActionsButtonsTableData: TableActionButtons[] = [
    {
        name: 'general.add',
        nameType: 'general.student',
        category: 'secondary',
        variant: 'primary',
        action: 'openCreateStudentDialog',
        icon: 'group_add'
    },
    {
        name: 'general.assignAssessment',
        category: 'tertiary',
        variant: 'primary',
        action: 'openAssignQuestionSetDialog',
        icon: 'event_available'
    },
    {
        name: 'general.compare',
        category: 'tertiary',
        variant: 'primary',
        action: 'onCompare',
        icon: 'compare'
    }
];
