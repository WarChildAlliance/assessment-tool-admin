import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AssessmentTableData } from 'src/app/core/models/assessment-table-data.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-assessments-answers',
  templateUrl: './assessments-answers.component.html',
  styleUrls: ['./assessments-answers.component.scss']
})
export class AssessmentsAnswersComponent implements OnInit {

  private currentStudentId: string;

  public assessmentsAnswersDataSource: MatTableDataSource<AssessmentTableData> = new MatTableDataSource([]);
  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'general.title' },
    { key: 'subject', name: 'general.subject' },
    { key: 'accessible_topics_count', name: 'answers.assessmentAnswers.linkedTopicsNumber' },
    { key: 'completed_topics_count', name: 'answers.assessmentAnswers.completedTopicsNumber' },
    {
      key: 'last_session', name: 'general.lastLogin',
      type: 'date', sorting: 'desc'
    }
  ];

  public searchableColumns = ['title', 'subject'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private answerService: AnswerService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(first()).subscribe(
      ([params, queryParams]: [ParamMap, ParamMap]) => {
        this.currentStudentId = params.get('student_id');

        this.answerService.getAssessmentsAnswers(this.currentStudentId).subscribe(assessments => {
          this.assessmentsAnswersDataSource = new MatTableDataSource(assessments);
        });
      }
    );
  }

  public onOpenDetails(assessmentId: string): void {
    this.router.navigate(
      [`students/${this.currentStudentId}/assessments/${assessmentId}/topics`]
    );
  }
}
