import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Assessment } from 'src/app/core/models/answers/assessment.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-assessments-answers',
  templateUrl: './assessments-answers.component.html',
  styleUrls: ['./assessments-answers.component.scss']
})
export class AssessmentsAnswersComponent implements OnInit {

  assessmentsAnswersDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);
  currentStudentId: string;
  sessionId: string;

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'subject', name: 'Subject' },
    { key: 'accessible_topics_count', name: 'Number of topics accessible' },
    { key: 'completed_topics_count', name: 'Number of topics completed' },
  ];

  public searchableColumns = ['title', 'subject'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id }),
      param2: this.route.queryParams.subscribe(params => { this.sessionId = params.session_id })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {
      if (!this.sessionId) {
        this.displayedColumns.push(
          { key: 'first_session_correct_answers_percentage', name: 'Correct answers percentage of first session', type: 'percentage' },
          { key: 'last_session_correct_answers_percentage', name: 'Correct answers percentage of last session', type: 'percentage' },
          { key: 'last_session', name: 'Last session date', type: 'date', sorting: 'desc' },
        )
      }

      this.answerService.getAssessmentsAnswers(this.currentStudentId, this.sessionId).subscribe(assessments => {
        this.assessmentsAnswersDataSource = new MatTableDataSource(assessments);
      });
    })
  }

  onOpenDetails(assessmentId: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments/${assessmentId}/topics`], { queryParams: { session_id: this.sessionId } });
  }
}
