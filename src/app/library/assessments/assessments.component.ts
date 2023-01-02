import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Assessment } from 'src/app/core/models/assessment.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { QuestionSetAccessesBuilderComponent } from 'src/app/shared/question-set-accesses-builder/question-set-accesses-builder.component';
import { QuestionSet } from '../../core/models/question-set.model';
import { TableFilterLibraryData } from 'src/app/core/models/table-filter.model';

@Component({
  selector: 'app-library',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit, AfterViewInit {

  @ViewChild('createAssessmentDialog') createAssessmentDialog: TemplateRef<any>;

  public displayedColumns: TableColumn[] = [
    { key: 'icon', name: ' ', type: 'image' },
    { key: 'grade', name: 'grade' },
    { key: 'title', name: 'assessments.title' },
    { key: 'expand', name: ' ', type: 'expand' },
    { key: 'invites', name: 'assessments.invites' },
    { key: 'plays', name: 'assessments.plays' },
    { key: 'score', name: 'assessments.score', type: 'score' },
    { key: 'button', name: ' ', type: 'button', label: 'library.assign', icon: 'event_started' }
  ];

  public assessmentsDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);
  public isAssessmentPrivate = false;

  public createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl('')
  });

  constructor(
    private assessmentService: AssessmentService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
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

  public onTableFiltersChange(tableFiltersData: TableFilterLibraryData): void {
    this.assessmentService.getAssessmentsList(tableFiltersData).subscribe((assessmentsList) => {
      assessmentsList = assessmentsList.filter((assessment) => assessment.archived !== true);
      assessmentsList.map(assessment => {
        this.assessmentService.getAssessmentQuestionSets(assessment.id).subscribe((topics: QuestionSet[]) => assessment.topics = topics);
      });
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
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

  public openAssignTopicDialog(assessment: Assessment): void {
    this.dialog.open(QuestionSetAccessesBuilderComponent, {
      data: { assessment }
    });
  }

  public resetFilters(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      assessmentsList = assessmentsList.filter((assessment) => assessment.archived !== true);
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }
}
