import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AnswerDetails } from 'src/app/core/models/answer-details.model';
import { QuestionSetAccessStudents } from 'src/app/core/models/question-set-access-students.model';
import { QuestionSetAnswer } from 'src/app/core/models/question-set-answer.model';
import { QuestionSetDashboard } from 'src/app/core/models/question-set-dashboard.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-answers-overview',
  templateUrl: './answers-overview.component.html',
  styleUrls: ['./answers-overview.component.scss']
})
export class AnswersOverviewComponent implements OnInit {

  public studentsList: QuestionSetAccessStudents[];
  public assessmentId: string;
  public questionSetId: string;
  public assessmentQuestionSetAnswer: string;
  public studentQuestionSetAnswers: QuestionSetAnswer[];

  public answerDetails: AnswerDetails;

  public evaluated: boolean;

  public index = 0;

  public selectedStudent: QuestionSetAccessStudents;

  public hasData = true;
  public loading = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService) { }

  ngOnInit(): void {}

  public getStudentListForQuestionSet(groupID?: number[]): void {
    this.loading = true;
    const filteringParams = groupID?.length ? { groups: groupID } : null;

    this.userService.getStudentsListForAQuestionSet(this.questionSetId, filteringParams)
    .subscribe(studentsList => {
      this.studentsList = studentsList;
      this.selectedStudent = this.studentsList.find(s => s.question_set_first_try !== null);
      if (this.selectedStudent) {
        this.selectStudent(this.selectedStudent);
      }
      this.loading = false;
    });
  }

  public onQuestionSetSelection(assessmentQuestionSetInfos: {assessmentId: string; questionSet: QuestionSetDashboard}): void {
    this.loading = true;
    if (assessmentQuestionSetInfos && assessmentQuestionSetInfos.questionSet.started) {
      this.assessmentId = assessmentQuestionSetInfos.assessmentId;
      this.questionSetId = assessmentQuestionSetInfos.questionSet.id;
      this.evaluated = assessmentQuestionSetInfos.questionSet.evaluated;
      this.getStudentListForQuestionSet();
    } else {
      this.hasData = false;
      this.loading = false;
    }
  }

  public selectStudent(student: QuestionSetAccessStudents): void {
    this.loading = true;
    this.selectedStudent = student;
    if (student.question_set_first_try) {
      this.assessmentQuestionSetAnswer = student.question_set_first_try.id;
      this.userService.getStudentQuestionSetAnswers(this.questionSetId, student.question_set_first_try.id).subscribe(questionSetAnswers => {
        this.studentQuestionSetAnswers = questionSetAnswers;
        this.displayAnswerDetails(this.studentQuestionSetAnswers[0]);
      });
    }
    this.loading = false;
  }

  public displayAnswerDetails(answer: QuestionSetAnswer): void {
    this.userService.getAnswerDetails(this.questionSetId, this.assessmentQuestionSetAnswer, answer.id).subscribe(answerDetails => {
      this.answerDetails = answerDetails;
      this.cdr.detectChanges();
    });
  }
}
