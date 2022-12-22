export interface TableColumn {

    // Key that should be used to retrieve the useful value from a row's object.
    key: string;

    // Column name on top of the table
    name: string;

    /* Only needed in case type = 'link' | 'button' */
    label?: string;

    /* Only needed in case type = 'button' or type = 'customized-icon'*/
    icon?: string;

    // Those are all the available types for a column. Different structures, styling and
    //  behaviors can then be defined on 'shared/table/table.component.html'
    // The 'action' type is a bit different, in that there is no precise value to retrieve,
    //  so the 'key' property is used as the Material icon name
    type?: null | 'boolean' | 'percentage' | 'date' | 'duration' | 'copy' | 'action' | 'circle' | 'link' | 'score' | 'icon' | 'image' |
     'button' | 'expand' | 'customized-icon' | 'menu' | 'score-list' | 'title' | 'navigate';

    // This property allows for default sorting on a column
    sorting?: 'asc' | 'desc';
}
