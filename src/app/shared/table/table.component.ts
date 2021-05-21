import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { TableFilter } from 'src/app/core/models/table-filter.model';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  // Notice here that the eventEmitter constructor accepts a "true" argument, which makes it asynchronous and prevents NG0100
  @Output() selectionChangedEvent = new EventEmitter<any[]>(true);
  @Output() filtersChangedEvent = new EventEmitter<{ key: string | number, value: any}>(true);
  @Output() openDetailsEvent = new EventEmitter<string>();

  constructor() { }

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

  // Return an array exclusively composed of the keys of the columns we want displayed
  getDisplayedColumnsKeys(): string[] {
    const displayedColumnsKeys = this.displayedColumns.map(column => column.key);
    if (this.isSelectable) {
      displayedColumnsKeys.unshift('select');
    }
    return displayedColumnsKeys;
  }

  // Returns the appropriate indicator color for a percentage
  // TODO This part should be improved by using class names instead
  getIndicatorColor(percentage: number): string {
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

  isAllSelected(): boolean {
    return this.selection.selected.length === this.tableData.data.length;
  }

  // Verify if all the filtered results are selected
  isAllFilteredSelected(): boolean {
    const result = this.tableData.filteredData.every(element => {
      return this.selection.selected.includes(element);
    });
    return result;
  }

  masterToggle(): void {
    if (this.isAllFilteredSelected()) {
      this.selection.clear();
    } else {
      this.tableData.filteredData.forEach(
        element => {
          this.selection.select(element);
        });
    }
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  applySelectFilters(key: string | number, value: any): void {
    this.filtersChangedEvent.emit({ key, value });
  }

  // If this function changes at some point, look into the backend API at : /visualization/serializers/TopicAnswerTableSerializer
  // In the class we override the returned 'id' because it's simpler (by default it's an "AssessmentTopicAnswer" id
  //  and we want an "AssessmentTopic" id), but it's not very clean, so change that if it's possible.
  openElementDetails(id: number): void {
    this.openDetailsEvent.emit(id.toString());
  }
}
