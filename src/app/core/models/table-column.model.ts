export interface TableColumn {
    key: string;
    name: string;
    type?: null | 'percentage' | 'date' | 'icon' | 'boolean' | 'copy' | 'circle' | 'duration';
    sorting?: 'asc' | 'desc';
}
