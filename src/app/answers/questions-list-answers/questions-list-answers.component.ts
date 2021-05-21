import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { QuestionTableData } from 'src/app/core/models/question-table-data.model';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-questions-list-answers',
  templateUrl: './questions-list-answers.component.html',
  styleUrls: ['./questions-list-answers.component.scss']
})
export class QuestionsListAnswersComponent implements OnInit {

  questionsAnswersDataSource: MatTableDataSource<QuestionTableData> = new MatTableDataSource([]);
  currentStudentId: string;
  assessmentId: string;
  topicId: string;
  sessionId: string;

  public displayedColumns: TableColumn[] = [
    { key: 'question_type', name: 'Question type' },
    { key: 'question_order', name: 'Order', sorting: 'asc' },
    { key: 'duration', name: 'Duration' },
    { key: 'valid', name: 'Valid', type: 'boolean' },
    { key: 'attachment_icon', name: 'Attachment', type: 'icon' }
  ];

  public searchableColumns = ['question_type', 'valid'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id; }),
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id; }),
      param3: this.route.params.subscribe(params => { this.topicId = params.topic_id; }),
      param4: this.route.queryParams.subscribe(params => { this.sessionId = params.session_id; })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {

      this.answerService.getQuestionsAnwsers(this.currentStudentId, this.assessmentId, this.topicId, this.sessionId)
        .subscribe(questions => {
          // There must be a prettier way of doing this, especially in the model...
          questions.forEach((question) => {
            question.has_attachment ? question.attachment_icon = 'attachment' : question.attachment_icon = null;
          });
          this.questionsAnswersDataSource = new MatTableDataSource(questions);
        });
    });
  }

  onOpenDetails(questionId: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${this.topicId}/questions/${questionId}`], { queryParams: { session_id: this.sessionId } });
  }
}
