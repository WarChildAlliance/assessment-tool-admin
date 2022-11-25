export interface TableFilter {
  key: string;
  name: string;
  type: 'select' | 'multipleSelect';
  displayType?: 'chip' | 'dropdown';
  options: { key: string | number; value: string }[];
}
