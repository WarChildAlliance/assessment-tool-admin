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

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'Question title' },
    { key: 'question_type', name: 'Question type' },
    { key: 'order', name: 'Order', sorting: 'asc' },
    { key: 'average_duration', name: 'Average time to answer', type: 'duration' },
    { key: 'correctly_answered_first_try', name: 'Correct on first try', type: 'boolean' },
    { key: 'correctly_answered_last_try', name: 'Correct on last try', type: 'boolean' },
    { key: 'question_preview', name: 'Preview' },
  ];

  public searchableColumns = ['title', 'question_type'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id; }),
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id; }),
      param3: this.route.params.subscribe(params => { this.topicId = params.topic_id; })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {

      this.answerService.getQuestionsAnwsers(this.currentStudentId, this.assessmentId, this.topicId)
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
    this.router.navigate([`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${this.topicId}/questions/${questionId}`]);
  }
}
