import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-topics-list-answers',
  templateUrl: './topics-list-answers.component.html',
  styleUrls: ['./topics-list-answers.component.scss']
})
export class TopicsListAnswersComponent implements OnInit {

  topicsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  currentStudentId: string;
  assessmentId: string;
  sessionId: string;

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'topic_name', value: 'Name' },
    { key: 'total_questions_count', value: 'Number of questions' },
    { key: 'answered_questions_count', value: 'Number of answered questions' },
    { key: 'correct_answers_percentage', value: 'Percentage of correct answers' },
    { key: 'complete', value: 'Completed' },
  ];

  public searchableColumns = ['topic_name', 'complete'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id }),
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id }),
      param4: this.route.queryParams.subscribe(params => { this.sessionId = params.session_id })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {

      this.answerService.getTopicsAnwsers(this.currentStudentId, this.assessmentId, this.sessionId).subscribe(topics => {
        this.topicsAnswersDataSource = new MatTableDataSource(topics);
      });
    })
  }

  onOpenDetails(topicId: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${topicId}/questions`], { queryParams: { session_id: this.sessionId }});
  }
}
