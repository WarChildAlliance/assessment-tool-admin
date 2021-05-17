import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-questions-list-answers',
  templateUrl: './questions-list-answers.component.html',
  styleUrls: ['./questions-list-answers.component.scss']
})
export class QuestionsListAnswersComponent implements OnInit {

  questionsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  currentStudentId: string;
  assessmentId: string;
  topicId: string;
  sessionId: string;

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'question_type', value: 'Question type' },
    { key: 'duration', value: 'Duration' },
    { key: 'valid', value: 'Valid' }
  ];

  public searchableColumns = ['question_type', 'valid'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id }),
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id }),
      param3: this.route.params.subscribe(params => { this.topicId = params.topic_id }),
      param4: this.route.queryParams.subscribe(params => { this.sessionId = params.session_id })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {

      this.answerService.getQuestionsAnwsers(this.currentStudentId, this.assessmentId, this.topicId, this.sessionId).subscribe(questions => {
        this.questionsAnswersDataSource = new MatTableDataSource(questions);
      });
    })
  }

  onOpenDetails(questionId: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${this.topicId}/questions/${questionId}`], { queryParams: { session_id: this.sessionId }});
  }
}
