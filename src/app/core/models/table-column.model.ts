export interface TableColumn {
    key: string;
    name: string;
    type?: null | 'percentage' | 'date' | 'icon' ;
    sorting?: 'asc' | 'desc';
}
