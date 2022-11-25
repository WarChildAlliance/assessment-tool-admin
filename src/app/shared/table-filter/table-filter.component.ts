import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableFilter } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit {
  @Input() filter: TableFilter;
  @Input() filterType: 'chip' | 'dropdown';

  @Output() filtersChangedEvent = new EventEmitter<{ key: string | number; value: any}>(true);

  constructor() { }

  ngOnInit(): void {
  }

  // select filters
  public applySelectFilters(key: string | number, value: any): void {
    this.filtersChangedEvent.emit({ key, value });
  }


}
