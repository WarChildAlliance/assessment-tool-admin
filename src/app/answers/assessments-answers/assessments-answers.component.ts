import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { AssessmentTableData } from 'src/app/core/models/assessment-table-data.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-assessments-answers',
  templateUrl: './assessments-answers.component.html',
  styleUrls: ['./assessments-answers.component.scss']
})
export class AssessmentsAnswersComponent implements OnInit {

  assessmentsAnswersDataSource: MatTableDataSource<AssessmentTableData> = new MatTableDataSource([]);
  currentStudentId: string;

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'subject', name: 'Subject' },
    { key: 'accessible_topics_count', name: 'Number of linked topics' },
    { key: 'completed_topics_count', name: 'Number of completed topics' },
    {
      key: 'last_session', name: 'Last login',
      type: 'date', sorting: 'desc'
    }
  ];

  public searchableColumns = ['title', 'subject'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private answerService: AnswerService
  ) { }

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

  onOpenDetails(assessmentId: string): void {
    this.router.navigate(
      [`students/${this.currentStudentId}/assessments/${assessmentId}/topics`]
    );
  }
}
