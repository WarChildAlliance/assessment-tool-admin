import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Assessment } from '../core/models/assessment.model';
import { AssessmentService } from '../core/services/assessment.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '../core/models/table-column.model';
import { TableFilter } from '../core/models/table-filter.model';
import { QuestionSetAccessesBuilderComponent } from '../shared/question-set-accesses-builder/question-set-accesses-builder.component';
import { QuestionSet } from '../core/models/question-set.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit, AfterViewInit {

  @ViewChild('createAssessmentDialog') createAssessmentDialog: TemplateRef<any>;

  public displayedColumns: TableColumn[] = [
    { key: 'icon', name: ' ', type: 'image' },
    { key: 'title', name: 'assessments.title' },
    { key: 'expand', name: ' ', type: 'expand' },
    { key: 'invites', name: 'assessments.invites' },
    { key: 'plays', name: 'assessments.plays' },
    { key: 'score', name: 'assessments.score', type: 'score' },
    { key: 'button', name: ' ', type: 'button', label: 'library.assign', icon: 'event_started' }
  ];

  public assessmentsDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);
  public tableFilters: TableFilter[];
  public isAssessmentPrivate = false;
  public filtersReset$ = new Subject<void>();

  public createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl('')
  });

  private tableFiltersData = { grade: '', subject: '', question_types: [], topic: '', learning_objectives: [] };

  constructor(
    private assessmentService: AssessmentService,
    private router: Router,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    this.tableFilters = [
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
          { key: 'Domino', value: 'DOMINO' },
          { key: 'Calcul', value: 'CALCUL' }
        ]
      },
    ];
    this.tableFilters.forEach(filter => {
      this.translateService.stream(filter.name).subscribe(translated => filter.name = translated);
    });
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      assessmentsList = assessmentsList.filter((assessment) => assessment.archived !== true);
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }

  ngAfterViewInit() {
    const arrows = document.querySelectorAll<HTMLElement>(
      '.mat-sort-header-arrow'
    );
    arrows.forEach((arrow) => (arrow.style.color = '#fff'));
  }

  public async onTableFiltersChange(data: { key: string | number; value: any }): Promise<void> {
    this.tableFiltersData[data.key] = !!data.value ? data.value: '';
    if (this.tableFiltersData?.subject || data.key === 'subject') {
      if (data.key === 'subject') {
        this.updateTopicsFilter(this.tableFiltersData.subject);
      }
      if (data.key === 'grade' || data.key === 'subject') {
        await this.updateNumberRangesFilter(
          this.tableFiltersData.grade,
          this.tableFiltersData.subject
        );
      }
      if (data.key === 'grade' || data.key === 'subject' || data.key === 'topic') {
        this.updateLearningObjectivesFilter(
          this.tableFiltersData.grade,
          this.tableFiltersData.subject,
          this.tableFiltersData.topic
        );
      }
    }
    this.assessmentService.getAssessmentsList(this.tableFiltersData).subscribe((assessmentsList) => {
      assessmentsList = assessmentsList.filter((assessment) => assessment.archived !== true);
      assessmentsList.map(assessment => {
        this.assessmentService.getAssessmentQuestionSets(assessment.id).subscribe(
          (question_sets: QuestionSet[]) => assessment.question_sets = question_sets
        );
      });
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }

  public onOpenDetails(id: string): void {
    this.router.navigate([`/library/${id}`]);
  }

  public togglePrivate(event: { checked: boolean }): void {
    this.isAssessmentPrivate = event.checked;
  }

  public deleteSelection(): void {
    console.log('DEL');
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }

  public openAssignQuestionSetDialog(assessment: Assessment): void {
    this.dialog.open(QuestionSetAccessesBuilderComponent, {
      data: { assessment }
    });
  }

  public resetFilters(): void {
    this.filtersReset$.next();
    const nestedFilters = ['topic', 'learning_objectives', 'number_range'];
    this.tableFilters = this.tableFilters.filter(item => !nestedFilters.includes(item.key));
    this.tableFiltersData = { grade: '', subject: '', question_types: [], topic: '', learning_objectives: [] };
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      assessmentsList = assessmentsList.filter((assessment) => assessment.archived !== true);
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }


  private updateTopicsFilter(subject: string): void {
    const topicFilterIndex = this.tableFilters.findIndex(filter => filter.key === 'topic');
    if (!subject || subject !== 'MATH') {
      if (topicFilterIndex !== -1) {
        this.tableFilters.splice(topicFilterIndex, 1);
        this.tableFiltersData.topic = '';
      }
      return;
    }
    this.assessmentService.getTopics(subject).subscribe((topics) => {
      if (topics?.length > 0) {
        this.tableFilters.splice(
          topicFilterIndex === -1 ? 3 : topicFilterIndex,
          topicFilterIndex === -1 ? 0 : 1,
          {
            key: 'topic',
            name: 'general.topic',
            type: 'select',
            displayType: 'chip',
            options: topics.map(topic => ({ key: topic.name, value: topic.id }))
          }
        );
        return;
      }
      this.tableFilters = this.tableFilters.filter(filter => filter.key !== 'topic');
    });
  }

  private async updateNumberRangesFilter(grade: string, subject: string): Promise<void> {
    const numberRangesFilterIndex = this.tableFilters.findIndex(filter => filter.key === 'number_range');
    if (!grade || subject !== 'MATH') {
      if (numberRangesFilterIndex !== -1) {
        this.tableFilters.splice(numberRangesFilterIndex, 1);
      }
      return;
    }
    const numberRanges = await this.assessmentService.getNumberRanges(grade).toPromise();
    if (numberRanges?.length > 1) {
      this.tableFilters.splice(
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
    this.tableFilters = this.tableFilters.filter(filter => filter.key !== 'number_range');
  }

  private updateLearningObjectivesFilter(grade: string, subject: string, topic: string): void {
    const loFilterIndex = this.tableFilters.findIndex(filter => filter.key === 'learning_objectives');
    if (subject !== 'MATH' || !topic) {
      if (loFilterIndex !== -1) {
        this.tableFilters.splice(loFilterIndex, 1);
        this.tableFiltersData.learning_objectives = [];
      }
      return;
    }
    const filteringParams = { grade, subject, topic };
    this.assessmentService.getLearningObjectives(filteringParams).subscribe((learningObjectives) => {
      if (learningObjectives?.length > 0) {
        this.tableFilters.splice(
          loFilterIndex === -1 ? this.tableFilters.length : loFilterIndex,
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
      this.tableFilters = this.tableFilters.filter(filter => filter.key !== 'learning_objective');
    });
  }
}
