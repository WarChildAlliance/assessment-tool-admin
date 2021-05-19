import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TableColumn } from 'src/app/core/models/table-column.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() displayedColumns: TableColumn[];
  @Input() tableData: MatTableDataSource<any>;
  @Input() isSelectable: boolean;
  @Input() searchableColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) tableSort: MatSort;

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  // Notice here that the eventEmitter constructor accepts a "true" argument, which makes it asynchronous and prevents NG0100
  @Output() selectionChangedEvent = new EventEmitter<any[]>(true);
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
    this.loadFilter();

    this.tableData.sort = this.tableSort;
    if (this.tableSort) { this.loadInitialSorting(); }
    this.tableData.paginator = this.paginator;
  }

  // Return an array exclusively composed of the keys of the columns we want displayed
  getDisplayedColumnsKeys(): string[] {
    const displayedColumnsKeys = [];
    if (this.isSelectable) { displayedColumnsKeys.push('select'); }

    // TODO We can improve this function by making it iterate in nested objects and retrieve the wanted value (by splicing the key on ".")
    this.displayedColumns.forEach(element => {
      displayedColumnsKeys.push(element.key);
    });
    return displayedColumnsKeys;
  }

  // Returns the appropriate indicator color for a percentage
  // TODO This part should be improved by removing the hard-coded values
  getIndicatorColor(percentage: number) {
    if (percentage < 41) {
      return 'red'
    } else if (percentage < 70) {
      return 'orange'
    } else if (percentage < 95) {
      return 'limegreen'
    } else {
      return 'green'
    }
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

  // If there are performance issues, the foreach could be replaced
  private loadFilter(): void {

    this.tableData.filterPredicate = (data, filterValue) => {
      let applyFilter = false;

      this.searchableColumns.forEach((key: string) => {
        let valueToMatchAgainst = data[key];

        if (valueToMatchAgainst && !applyFilter) {
          if (typeof (valueToMatchAgainst) === 'string') {
            valueToMatchAgainst = valueToMatchAgainst.toLowerCase();
          } else {
            valueToMatchAgainst = valueToMatchAgainst.toString().toLowerCase();
          }

          if (valueToMatchAgainst.includes(filterValue)) {
            applyFilter = true;
          }
        }
      });
      return applyFilter;
    };
  }

  // Sort the table on one of its elements at initialization
  private loadInitialSorting(): void {

    // Look for an element that should be used as initial sorting reference in the table data
    // Only one element can be used as such
    let initialSortTarget = this.displayedColumns.find((element) => element.sorting)

    if (initialSortTarget) {
      // Find the corresponding MatSortable element
      let initialSortElement = this.tableData.sort.sortables.get(initialSortTarget.key);

      // Attribute the sorting order according to the specified parameter
      initialSortElement.start = initialSortTarget.sorting;

      // Do an initial sorting matching these conditions
      this.tableData.sort.sort(initialSortElement)
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  // If this function changes at some point, look into the backend API at : /visualization/serializers/TopicAnswerTableSerializer
  // In the class we override the returned 'id' because it's simpler (by default it's an "AssessmentTopicAnswer" id
  //  and we want an "AssessmentTopic" id), but it's not very clean, so change that if it's possible.
  openElementDetails(id: number): void {
    this.openDetailsEvent.emit(id.toString());
  }
}
