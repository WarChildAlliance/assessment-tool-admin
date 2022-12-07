import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Subject} from 'rxjs';
import { TableFilter } from 'src/app/core/models/table-filter.model';
import { TableActionButtons } from 'src/app/core/models/table-actions-buttons.model';
import { TranslateService } from '@ngx-translate/core';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss']
})
export class TableActionsComponent implements OnInit {

  @Input() filtersData: TableFilter[];
  @Input() libraryFilters: boolean;
  @Input() hideSearchBar: boolean;
  @Input() buttons: TableActionButtons[];

  @Output() filtersChangedEvent = new EventEmitter<any>(true);
  @Output() resetFiltersEvent = new EventEmitter<boolean>(true);
  @Output() searchChangedEvent = new EventEmitter<string>();
  @Output() customActionEvent = new EventEmitter<any>();
  @Output() buttonClickedEvent = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput: ElementRef;
  public filtersReset$ = new Subject<void>();
  public filters: TableFilter[];

  // private tableFilters: TableFilter[];
  private tableFiltersData = { grade: '', subject: '', question_types: [], subtopic: '', learning_objectives: [] };

  constructor(
    private translateService: TranslateService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    // Filters used in the library section (library, questions and topics)
    if (this.libraryFilters){
      this.setupFilters();
    }
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

  // Used for the filters library
  public async onTableFiltersChange(data: { key: string | number; value: any }): Promise<void> {
    this.tableFiltersData[data.key] = !!data.value ? data.value: '';
    if (this.tableFiltersData?.subject || data.key === 'subject') {
      if (data.key === 'subject') {
        this.updateSubtopicsFilter(this.tableFiltersData.subject);
      }
      if (data.key === 'grade' || data.key === 'subject') {
        await this.updateNumberRangesFilter(
          this.tableFiltersData.grade,
          this.tableFiltersData.subject
        );
      }
      if (data.key === 'grade' || data.key === 'subject' || data.key === 'subtopic') {
        this.updateLearningObjectivesFilter(
          this.tableFiltersData.grade,
          this.tableFiltersData.subject,
          this.tableFiltersData.subtopic
        );
      }
    }
    this.filtersChangedEvent.emit(this.tableFiltersData);
  }

  public resetFilters(): void {
    this.filtersReset$.next();
    this.resetFiltersEvent.emit(true);
    this.searchInput.nativeElement.value = '';

    if (this.libraryFilters) {
      const nestedFilters = ['subtopic', 'learning_objectives', 'number_range'];
      this.filtersData = this.filtersData.filter(item => !nestedFilters.includes(item.key));
      this.tableFiltersData = { grade: '', subject: '', question_types: [], subtopic: '', learning_objectives: [] };
    }
  }

  private updateSubtopicsFilter(subject: string): void {
    const subtopicFilterIndex = this.filtersData.findIndex(filter => filter.key === 'subtopic');
    if (!subject || subject !== 'MATH') {
      if (subtopicFilterIndex !== -1) {
        this.filtersData.splice(subtopicFilterIndex, 1);
        this.tableFiltersData.subtopic = '';
      }
      return;
    }
    this.assessmentService.getSubtopics(subject).subscribe((subtopics) => {
      if (subtopics?.length > 0) {
        this.filtersData.splice(
          subtopicFilterIndex === -1 ? 3 : subtopicFilterIndex,
          subtopicFilterIndex === -1 ? 0 : 1,
          {
            key: 'subtopic',
            name: 'assessmentBuilder.subtopic',
            type: 'select',
            displayType: 'chip',
            options: subtopics.map(subtopic => ({ key: subtopic.name, value: subtopic.id }))
          }
        );
        return;
      }
      this.filtersData = this.filtersData.filter(filter => filter.key !== 'subtopic');
    });
  }

  private async updateNumberRangesFilter(grade: string, subject: string): Promise<void> {
    const numberRangesFilterIndex = this.filtersData.findIndex(filter => filter.key === 'number_range');
    if (!grade || subject !== 'MATH') {
      if (numberRangesFilterIndex !== -1) {
        this.filtersData.splice(numberRangesFilterIndex, 1);
      }
      return;
    }
    const numberRanges = await this.assessmentService.getNumberRanges(grade).toPromise();
    if (numberRanges?.length > 1) {
      this.filtersData.splice(
        numberRangesFilterIndex === -1 ? 4 : numberRangesFilterIndex,
        numberRangesFilterIndex === -1 ? 0 : 1,
        {
          key: 'number_range',
          name: 'library.numberRanges',
          type: 'select',
          displayType: 'chip',
          options: numberRanges.map(numberRange => ({ key: numberRange.handle, value: numberRange.id }))
        }
      );
      return;
    }
    this.filtersData = this.filtersData.filter(filter => filter.key !== 'number_range');
  }

  private updateLearningObjectivesFilter(grade: string, subject: string, subtopic: string): void {
    const loFilterIndex = this.filtersData.findIndex(filter => filter.key === 'learning_objectives');
    if (subject !== 'MATH' || !subtopic) {
      if (loFilterIndex !== -1) {
        this.filtersData.splice(loFilterIndex, 1);
        this.tableFiltersData.learning_objectives = [];
      }
      return;
    }
    const filteringParams = { grade, subject, subtopic };
    this.assessmentService.getLearningObjectives(filteringParams).subscribe((learningObjectives) => {
      if (learningObjectives?.length > 0) {
        this.filtersData.splice(
          loFilterIndex === -1 ? this.filtersData.length : loFilterIndex,
          loFilterIndex === -1 ? 0 : 1,
          {
            key: 'learning_objectives',
            name: 'assessmentBuilder.learningObjective',
            type: 'multipleSelect',
            displayType: 'dropdown',
            options: learningObjectives.map(lo => ({ key: lo.name_eng, value: lo.code }))
          }
        );
        return;
      }
      this.filtersData = this.filtersData.filter(filter => filter.key !== 'learning_objective');
    });
  }

  private setupFilters(): void {
    this.filtersData = [
      {
        key: 'grade',
        name: 'general.grade',
        type: 'select',
        displayType: 'chip',
        options: ['1','2','3'].map(grade => ({ key: `Grade ${grade}`, value: grade  }))
      },
      {
        key: 'subject',
        name: 'general.subject',
        type: 'select',
        displayType: 'chip',
        options: ['Math', 'Literacy'].map(subject => ({ key: subject, value: subject.toUpperCase() }))
      },
      {
        key: 'question_types',
        name: 'library.questionType',
        type: 'multipleSelect',
        displayType: 'dropdown',
        options: [
          { key: 'Social and Emotional Learning', value: 'SEL' },
          { key: 'Select', value: 'SELECT' },
          { key: 'Input', value: 'INPUT' },
          { key: 'Number line', value: 'NUMBER_LINE' },
          { key: 'Drag and Drop', value: 'DRAG_AND_DROP' },
          { key: 'Customized Drag and Drop', value: 'CUSTOMIZED_DRAG_AND_DROP' },
          { key: 'Domino', value: 'DOMINO' },
          { key: 'Calcul', value: 'CALCUL' }
        ]
      },
    ];
    this.filtersData.forEach(filter => {
      this.translateService.stream(filter.name).subscribe(translated => filter.name = translated);
    });
  }
}
