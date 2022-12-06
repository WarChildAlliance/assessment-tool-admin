import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Subject} from 'rxjs';
import { TableFilter } from 'src/app/core/models/table-filter.model';
import { TableActionButtons } from 'src/app/core/models/table-actions-buttons.model';

@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss']
})
export class TableActionsComponent implements OnInit {

  @Input() filtersData: TableFilter[];
  @Input() hideSearchBar: boolean;
  @Input() buttons: TableActionButtons[];
  @Input() filtersReset$: Subject<void>;

  @Output() filtersChangedEvent = new EventEmitter<{ key: string | number; value: any}>(true);
  @Output() searchChangedEvent = new EventEmitter<string>();
  @Output() customActionEvent = new EventEmitter<any>();
  @Output() buttonClickedEvent = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.filtersReset$.subscribe(() => {
      this.searchInput.nativeElement.value = '';
    });
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

  public buttonClicked(action: any): void {
    this.buttonClickedEvent.emit(action);
  }
}
