import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableFilter } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss']
})
export class TableActionsComponent implements OnInit {

  @Input() filtersData: TableFilter[];
  @Input() hideSearchBar: boolean;

  @Output() filtersChangedEvent = new EventEmitter<{ key: string | number; value: any}>(true);
  @Output() searchChangedEvent = new EventEmitter<string>();
  @Output() customActionEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  // search bar
  public applySearchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const tableDataFilter = filterValue.trim().toLowerCase();
    this.searchChangedEvent.emit(tableDataFilter);
  }

  // Emit an event asking for a custom action to trigger on parent element
  // The element object is the row on wich the user triggered the action.
  public customAction(element: any): void {
    this.customActionEvent.emit(element);
  }
}