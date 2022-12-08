import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-assessment-detail',
  templateUrl: './assessment-detail.component.html',
  styleUrls: ['./assessment-detail.component.scss']
})
export class AssessmentDetailComponent implements OnInit {

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'general.name' },
    { key: 'students_count', name: 'assessments.assessmentDetail.activeAccessStudents' },
    { key: 'students_completed_count', name: 'assessments.assessmentDetail.activeAccessCompletedStudents' },
    { key: 'overall_students_completed_count', name: 'assessments.assessmentDetail.studentsCompleted' },
    { key: 'questions_count', name: 'general.questionsNumber' }
  ];

  public questionSetsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  public isAssessmentPrivate = false;

  public selectedQuestionSets: any[] = [];

  public currentAssessment: any;

  public createNewQuestionSetForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService
  ) {
      this.displayedColumns.forEach(col => {
        this.translateService.stream(col.name).subscribe(translated => col.name = translated);
      });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const assessmentId = params.id;

      this.assessmentService.getAssessmentQuestionSets(assessmentId).subscribe((questionSetsList) => {
        this.questionSetsDataSource = new MatTableDataSource(questionSetsList);
      });

      this.assessmentService.getAssessmentDetails(assessmentId).subscribe(assessment => {
        this.currentAssessment = assessment;
      });
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  public onSelectionChange(newSelection: any[]): void {
    this.selectedQuestionSets = newSelection;
  }

  public onOpenDetails(id: string): void {
    this.router.navigate([`/library/${this.currentAssessment.id}question-sets/${id}`]);
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }
}
