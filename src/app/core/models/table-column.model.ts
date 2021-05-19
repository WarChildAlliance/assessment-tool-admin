export interface TableColumn {
    key: string;
    name: string;
    type?: null | 'percentage' | 'date' | 'icon' | 'boolean' ;
    sorting?: 'asc' | 'desc';
}
