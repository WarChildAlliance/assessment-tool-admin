import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { TableFilter } from 'src/app/core/models/table-filter.model';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() displayedColumns: TableColumn[];
  @Input() tableData: MatTableDataSource<any>;
  @Input() filtersData: TableFilter[];
  @Input() isSelectable: boolean;
  @Input() searchableColumns: string[];
  @Input() hideSearchBar: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  // Notice here that the eventEmitter constructor accepts a "true" argument, which makes it asynchronous and prevents NG0100
  @Output() selectionChangedEvent = new EventEmitter<any[]>(true);
  @Output() filtersChangedEvent = new EventEmitter<{ key: string | number; value: any}>(true);
  @Output() openDetailsEvent = new EventEmitter<string>();
  @Output() customActionEvent = new EventEmitter<any>();

  constructor(
    private translateService: TranslateService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.selection.changed.subscribe(() => {
      this.selectionChangedEvent.emit(this.selection.selected);
    });
  }

  ngOnChanges(): void {
    // Be careful: if ngOnChanges has reasons to trigger other than tableData being updated,
    // it might be interesting to move the following line in a setter for tableData.
    this.selection.clear();
    // this.loadFilter();

    this.tableData.sort = this.sort;
    if (this.sort) {
      this.loadInitialSorting();
    }
    this.tableData.paginator = this.paginator;
  }

  // Verify if all the filtered results are selected
  private isAllFilteredSelected(): boolean {
    const result = this.tableData.filteredData.every(element => this.selection.selected.includes(element));
    return result;
  }

  // Sort the table on one of its elements at initialization
  private loadInitialSorting(): void {
    // Look for an element that should be used as initial sorting reference in the table data
    // Only one element can be used as such
    const initialSortTarget = this.displayedColumns.find((element) => element.sorting);

    if (initialSortTarget) {
      // Find the corresponding MatSortable element
      const initialSortElement = this.tableData.sort.sortables.get(initialSortTarget.key);

      // Attribute the sorting order according to the specified parameter
      initialSortElement.start = initialSortTarget.sorting;

      // Do an initial sorting matching these conditions
      this.tableData.sort.sort(initialSortElement);
    }
  }

  // Return an array exclusively composed of the keys of the columns we want displayed
  public getDisplayedColumnsKeys(): string[] {
    const displayedColumnsKeys = this.displayedColumns.map(column => column.key);
    if (this.isSelectable) {
      displayedColumnsKeys.unshift('select');
    }
    return displayedColumnsKeys;
  }

  // Returns the appropriate indicator color for a percentage
  // TODO This part should be improved by using class names instead
  public getIndicatorColor(percentage: number): string {
    if (!percentage && percentage !== 0) {
      return 'inherit';
    }
    if (percentage < 41) {
      return 'red';
    }
    if (percentage < 70) {
      return 'orange';
    }
    if (percentage < 95) {
      return 'limegreen';
    }
    return 'green';
  }

  public isAllSelected(): boolean {
    return this.selection.selected.length === this.tableData.data.length;
  }

  public masterToggle(): void {
    if (this.isAllFilteredSelected()) {
      this.selection.clear();
    } else {
      this.tableData.filteredData.forEach(
        element => {
          this.selection.select(element);
        });
    }
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  public applySelectFilters(key: string | number, value: any): void {
    this.filtersChangedEvent.emit({ key, value });
  }

  public openElementDetails(id): void {
    this.openDetailsEvent.emit(id.toString());
  }

  public copyAlert(): void {
    this.alertService.success(this.translateService.instant('shared.table.copySuccess'));
  }

  // Emit an event asking for a custom action to trigger on parent element
  // The element object is the row on wich the user triggered the action.
  public customAction(element: any): void {
    this.customActionEvent.emit(element);
  }
}
