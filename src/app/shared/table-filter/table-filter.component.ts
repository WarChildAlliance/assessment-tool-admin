import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { TableFilter } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit {
  @Input() filter: TableFilter;
  @Input() filterType: 'chip' | 'dropdown';
  @Input() filterReset$: Subject<void>;

  @Output() filtersChangedEvent = new EventEmitter<{ key: string | number; value: any}>(true);

  @ViewChild('selectFilter') selectRef: MatSelect;

  constructor() { }

  ngOnInit(): void {
    if (this.filterReset$) {
      this.filterReset$.subscribe(() => {
        this.selectRef?.options.forEach(option => {
          if (option.selected) {
            option.deselect();
          }
        });
      });
    }
  }

  // select filters
  public applySelectFilters(key: string | number, value: any): void {
    this.filtersChangedEvent.emit({ key, value });
  }


}
