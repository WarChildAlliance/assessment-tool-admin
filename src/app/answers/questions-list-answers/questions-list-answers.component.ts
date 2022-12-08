import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { QuestionTableData } from 'src/app/core/models/question-table-data.model';
import { AnswerService } from 'src/app/core/services/answer.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { QuestionSetTableData } from 'src/app/core/models/question-set-table-data.model';

@Component({
  selector: 'app-questions-list-answers',
  templateUrl: './questions-list-answers.component.html',
  styleUrls: ['./questions-list-answers.component.scss']
})
export class QuestionsListAnswersComponent implements OnInit {

  @ViewChild('questionPreviewDialog') questionPreviewDialog: TemplateRef<any>;

  public currentStudentId: string;
  public assessmentId: string;
  public questionSetId: string;

  public questionsAnswersDataSource: MatTableDataSource<QuestionTableData> = new MatTableDataSource([]);
  public currentStudent: StudentTableData;
  public currentQuestionSet: QuestionSetTableData;

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'answers.questionsListAnswers.questionTitle' },
    { key: 'question_type', name: 'general.questionType' },
    { key: 'order', name: 'general.order', sorting: 'asc' },
    { key: 'average_duration', name: 'answers.questionsListAnswers.averageTimeAnswer', type: 'duration' },
    { key: 'correctly_answered_first_try', name: 'answers.questionsListAnswers.correctOnFirstTry', type: 'boolean' },
    { key: 'correctly_answered_last_try', name: 'answers.questionsListAnswers.correctOnLastTry', type: 'boolean' },
    { key: 'remove_red_eye', name: 'general.preview', type: 'action' },
  ];

  public searchableColumns = ['title', 'question_type'];
  public questionDetails: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private assessmentService: AssessmentService,
    private answerService: AnswerService,
    private matDialog: MatDialog,
    private userService: UserService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id; }),
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id; }),
      param3: this.route.params.subscribe(params => { this.questionSetId = params.question_set_id; })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {
      this.answerService.getQuestionsAnwsers(this.currentStudentId, this.assessmentId, this.questionSetId)
        .subscribe(questions => {
          this.questionsAnswersDataSource = new MatTableDataSource(questions);
        });

      this.answerService.getQuestionSetsAnswersDetails(this.currentStudentId,
        this.assessmentId, this.questionSetId).subscribe(questionSet => {
          this.currentQuestionSet = questionSet;
        });

      this.userService.getStudentDetails(this.currentStudentId).subscribe(student => {
          this.currentStudent = student;
        });
    });
  }

  public onOpenDetails(questionId: string): void {
    /*
    this.router.navigate([`students/${this.currentStudentId}/assessments/
      ${this.assessmentId}question-sets/${this.questionSetId}/questions/${questionId}`]);
    */
  }

  public onCustomAction(element: any): void {
    this.assessmentService.getQuestionDetails(this.assessmentId, this.questionSetId, element.id).subscribe(details => {
      this.questionDetails = details;

      // To add scroll in the dialog because the drag and drop component has a height that can cause problems
      let config = {};
      if (this.questionDetails.question_type === 'DRAG_AND_DROP') {
        config = {
          height: '95%'
        };
      }

      this.matDialog.open(this.questionPreviewDialog, config);
    });
  }
}
