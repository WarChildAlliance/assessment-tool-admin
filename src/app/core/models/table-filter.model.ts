export interface TableFilter {
  key: string;
  name: string;
  type: 'select' | 'multipleSelect';
  displayType?: 'chip' | 'dropdown';
  options: { key: string | number; value: string }[];
}

export interface TableFilterLibraryData {
  grade?: string;
  subject?: string;
  question_types?: any[];
  subtopic?: string;
  learning_objectives?: any[];
}
