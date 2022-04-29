import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AssessmentTableData } from 'src/app/core/models/assessment-table-data.model';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { TopicTableData } from 'src/app/core/models/topic-table-data.model';
import { AnswerService } from 'src/app/core/services/answer.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-topics-list-answers',
  templateUrl: './topics-list-answers.component.html',
  styleUrls: ['./topics-list-answers.component.scss']
})
export class TopicsListAnswersComponent implements OnInit {

  topicsAnswersDataSource: MatTableDataSource<TopicTableData> = new MatTableDataSource([]);
  currentStudentId: string;
  assessmentId: string;

  currentStudent: StudentTableData;
  currentAssessment: AssessmentTableData;

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'general.name' },
    { key: 'questions_count', name: 'answers.questionsNumber' },
    { key: 'student_tries_count', name: 'answers.topicListAnswers.triesNumber' },
    { key: 'correct_answers_percentage_first_try', name: 'answers.topicListAnswers.answeredCorrectlyFirstTry', type: 'percentage' },
    { key: 'correct_answers_percentage_last_try', name: 'answers.topicListAnswers.answeredCorrectlyLastTry', type: 'percentage' },
    { key: 'last_submission', name: 'answers.topicListAnswers.lastSubmission', type: 'date' },
  ];

  public searchableColumns = ['name'];

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
      this.answerService.getTopicsAnswers(this.currentStudentId, this.assessmentId).subscribe(topics => {
        this.topicsAnswersDataSource = new MatTableDataSource(topics);
      });

      this.answerService.getAssessmentsAnswersDetails(this.currentStudentId, this.assessmentId).subscribe(assessment => {
        this.currentAssessment = assessment;
      });

      this.userService.getStudentDetails(this.currentStudentId).subscribe(student => {
        this.currentStudent = student;
      });
    });
  }

  onOpenDetails(topicId: string): void {
    this.router.navigate(
      [`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${topicId}/questions`]
    );
  }
}
