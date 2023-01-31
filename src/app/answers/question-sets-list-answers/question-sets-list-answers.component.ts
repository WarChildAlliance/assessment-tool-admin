import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AssessmentTableData } from 'src/app/core/models/assessment-table-data.model';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { QuestionSetTableData } from 'src/app/core/models/question-set-table-data.model';
import { AnswerService } from 'src/app/core/services/answer.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-question-sets-list-answers',
  templateUrl: './question-sets-list-answers.component.html',
  styleUrls: ['./question-sets-list-answers.component.scss']
})
export class QuestionSetsListAnswersComponent implements OnInit {

  public currentStudentId: string;

  public questionSetsAnswersDataSource: MatTableDataSource<QuestionSetTableData> = new MatTableDataSource([]);
  public currentStudent: StudentTableData;
  public currentAssessment: AssessmentTableData;

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'general.name' },
    { key: 'questions_count', name: 'general.questionsNumber' },
    { key: 'student_tries_count', name: 'answers.questionSetListAnswers.triesNumber' },
    { key: 'correct_answers_percentage_first_try', name: 'answers.questionSetListAnswers.answeredCorrectlyFirstTry', type: 'percentage' },
    { key: 'correct_answers_percentage_last_try', name: 'answers.questionSetListAnswers.answeredCorrectlyLastTry', type: 'percentage' },
    { key: 'last_submission', name: 'answers.questionSetListAnswers.lastSubmission', type: 'date' },
  ];

  public searchableColumns = ['name'];

  private assessmentId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private answerService: AnswerService,
    private userService: UserService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id; }),
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id; })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {
      this.answerService.getQuestionSetsAnswers(this.currentStudentId, this.assessmentId).subscribe(questionSets => {
        this.questionSetsAnswersDataSource = new MatTableDataSource(questionSets);
      });

      this.answerService.getAssessmentsAnswersDetails(this.currentStudentId, this.assessmentId).subscribe(assessment => {
        this.currentAssessment = assessment;
      });

      this.userService.getStudentDetails(this.currentStudentId).subscribe(student => {
        this.currentStudent = student;
      });
    });
  }

  public onOpenDetails(questionSetId: string): void {
    this.router.navigate(
      [`students/${this.currentStudentId}/assessments/${this.assessmentId}/question-sets/${questionSetId}/questions`]
    );
  }
}
