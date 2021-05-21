export interface TableFilter {
  key: string;
  name: string;
  type: 'select' | 'multipleSelect';
  options: { key: string | number, value: string }[];
}
