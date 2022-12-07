import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Assessment } from '../core/models/assessment.model';
import { AssessmentService } from '../core/services/assessment.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '../core/models/table-column.model';
import { TableFilterLibraryData } from '../core/models/table-filter.model';
import { TopicAccessesBuilderComponent } from '../shared/topic-accesses-builder/topic-accesses-builder.component';
import { Topic } from '../core/models/topic.models';

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
    private router: Router,
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
        this.assessmentService.getAssessmentTopics(assessment.id).subscribe((topics: Topic[]) => assessment.topics = topics);
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

  public openAssignTopicDialog(assessment: Assessment): void {
    this.dialog.open(TopicAccessesBuilderComponent, {
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
