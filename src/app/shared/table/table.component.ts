import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { TableFilter } from 'src/app/core/models/table-filter.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';
import { TableActionButtons } from 'src/app/core/models/table-actions-buttons.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({
        height: '0px',
        minHeight: '0'
      })),
      state('expanded', style({
        height: '*',
      })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TableComponent implements OnInit, OnChanges {

  @Input() displayedColumns: TableColumn[];
  @Input() tableData: MatTableDataSource<any>;
  @Input() filtersData: TableFilter[];
  @Input() filtersReset$: Subject<void>;
  @Input() pageConfig: string;
  @Input() isSelectable: boolean;
  @Input() searchableColumns: string[];
  @Input() hideSearchBar: boolean;
  @Input() libraryFilters: boolean;
  @Input() scoreListLength: number;
  @Input() actionsButtons: TableActionButtons[];
  @Input() hasFilters = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Notice here that the eventEmitter constructor accepts a "true" argument, which makes it asynchronous and prevents NG0100
  @Output() selectionChangedEvent = new EventEmitter<any[]>(true);
  @Output() filtersChangedEvent = new EventEmitter<any>(true);
  @Output() openDetailsEvent = new EventEmitter<string>();
  @Output() customActionEvent = new EventEmitter<any>();
  @Output() buttonClickedEvent = new EventEmitter<any>(true);
  @Output() subMenuEvent = new EventEmitter<any>();
  @Output() actionButtonEvent = new EventEmitter<any>();
  @Output() resetFiltersEvent = new EventEmitter<boolean>(true);

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);
  public expandedRow: any = null;
  public expandedData: any = null;
  public hasPaginator = true;
  public loading = true;

  public selOptions = [
    {id: 'NOT_REALLY', icon: 'notReallyLikeMe'},
    {id: 'A_LITTLE', icon: 'aLittleLikeMe'},
    {id: 'A_LOT', icon: 'aLotLikeMe'}
  ];

  constructor(
    private translateService: TranslateService,
    private alertService: AlertService,
    private router: Router
  ) {}

  public get accentColor() {
    switch (this.pageConfig) {
      case 'library': return '#FF5722';
      case 'students': return '#00BCD4';
      case 'groups': return '#3F51B5';
      case 'questions': return '#FFC801';
      case 'dashboard': return '#009688';
      default: return '#53A8E2';
    }
  }

  public get textHeaderColor() {
    switch (this.pageConfig) {
      case 'questions': return '#666666';
      default: return '#fff';
    }
  }

  ngOnInit(): void {
    if (this.pageConfig === 'dashboard') {
      this.hasPaginator = false;
    }
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
    if (this.hasPaginator) {
      this.tableData.paginator = this.paginator;
    }
  }

  public isInstance(value: any, type: string): boolean {
    return typeof value === type;
  }

  public getSelOption(statement: string): any {
    return this.selOptions.find(e => e.id === statement);
  }

  // Returns the appropriate icon to represent SEL progress
  // SEL progress values can either be -1, 0 or 1
  public getSelArrowIcon(progress: number): string {
    return ['arrow_red_down', 'arrow_yellow_right', 'arrow_red_down'][
      progress + 1
    ];
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

  // Remove when filter component done
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  // put it directly in the HTML like did with (filtersChangedEvent)?
  public applySearchFilter(tableDataFilter: string): void {
    this.tableData.filter = tableDataFilter;
  }

  // Remove when filter component done
  public applySelectFilters(key: string | number, value: any): void {
    this.filtersChangedEvent.emit({ key, value });
  }

  public openElementDetails(id): void {
    this.openDetailsEvent.emit(id.toString());

    if (this.pageConfig === 'students') {
      const student = this.tableData.data.find(e => e.id === id);
      const firstAssessment = student.assessments[0] ?? null;
      this.toggleExpandRow(student, firstAssessment);
    } else if (this.pageConfig === 'library' || this.pageConfig === 'questions') {
      const element = this.tableData.data.find(e => e.id === id);
      this.toggleExpandRow(element, element);
    }
  }

  public copyAlert(): void {
    this.alertService.success(this.translateService.instant('shared.table.copySuccess'));
  }

  // Emit an event asking for a custom action to trigger on parent element
  // The element object is the row on wich the user triggered the action.
  public customAction(element: any): void {
    this.customActionEvent.emit(element);
  }

  public buttonClicked(element: any): void {
    this.buttonClickedEvent.emit(element);
  }

  public subMenuClicked(element: any, action: string): void {
    this.selection.setSelection(element);
    this.subMenuEvent.emit({element, action});
  }

  // TableActionsComponent button clicked
  public actionButtonClicked(action: any): void {
    this.actionButtonEvent.emit(action);
  }

  public getSource(path: string): string {
    return `${environment.API_URL}${path}`;
  }

  public isHeaderSortingDisabled(str: string): boolean {
    return !str || /^\s*$/.test(str);
  }

  public isRowExpanded(row): boolean {
    return row === this.expandedRow;
  }

  public toggleExpandRow(row: any, data: any, expandedKey: string = null): void {
    if (expandedKey) {
      if (this.expandedRow === row && expandedKey === this.expandedData?.expandedKey) {
        this.expandedData = null;
      } else {
        this.expandedData = { ...data, expandedKey };
      }
    } else {
      this.expandedData = this.expandedData === data ? null : data;
    }
    if (!this.expandedData) {
      this.expandedRow = this.expandedRow === row ? null : row;
    } else {
      this.expandedRow = row;
    }
  }

  public navigateToPage(page: string): void {
    this.router.navigate([page]);
  }

  // Verify if all the filtered results are selected
  private isAllFilteredSelected(): boolean {
    const result = this.tableData.filteredData.every(element => this.selection.selected.includes(element));
    return result;
  }

  // Sort the table on one of its elements at initialization
  private loadInitialSorting(): void {
    this.loading = true;
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
    this.loading = false;
  }
}
