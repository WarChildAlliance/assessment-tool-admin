import { TableActionButtons } from './table-actions-buttons.model';

export interface GroupTableData {
    id: number;
    name: string;
    students_count: number;
    questions_count?: number;
    honey?: number;
    average?: number;
    assessments_average?: number[];
    speed?: any[];
    subMenu?: any;
}

export const GroupSubMenuTableData = [
    {
      action:  'onOpenDetails',
      icon: 'person',
      name: 'groups.seeStudents',
      color: '#4AA0DB'
  },
  {
      action:  'onEdit',
      icon: 'edit',
      name: 'general.edit',
      color: '#4AA0DB'
  },
  {
      action:  'onDelete',
      icon: 'delete',
      name: 'general.delete',
      color: '#FF5252'
  }
];

export const GroupActionsButtonsTableData: TableActionButtons[] = [
    {
        name: 'general.add',
        nameType: 'general.group',
        category: 'secondary',
        variant: 'primary',
        action: 'onCreate',
        icon: 'group_add'
    },
    {
        name: 'groups.assignAssessment',
        category: 'tertiary',
        variant: 'primary',
        action: 'onAssignAssessment',
        icon: 'event_available'
    },
    {
        name: 'groups.compare',
        category: 'tertiary',
        variant: 'primary',
        action: 'onCompare',
        icon: 'compare'
    }
];

