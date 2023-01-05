import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Question } from 'src/app/core/models/question.model';
import { AnswerDetails } from 'src/app/core/models/answer-details.model';
import { Assessment } from '../../core/models/assessment.model';
import { AssessmentTableData } from 'src/app/core/models/assessment-table-data.model';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { QuestionSet } from '../../core/models/question-set.model';
import { AssessmentService } from '../../core/services/assessment.service';
import { AnswerService } from 'src/app/core/services/answer.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { QuestionSetAccessesBuilderComponent } from '../question-set-accesses-builder/question-set-accesses-builder.component';

@Component({
  selector: 'app-table-row-details',
  templateUrl: './table-row-details.component.html',
  styleUrls: ['./table-row-details.component.scss']
})
export class TableRowDetailsComponent implements OnInit, OnChanges {

  @Input() config: string;
  @Input() rowData: StudentTableData | Assessment;
  @Input() data: any;

  public setIndex = 0;
  public itemIndex = 0;
  public assessmentId: string;
  public loading = true;

  private itemSets: QuestionSet[] | AssessmentTableData[];

  constructor(
    public utilitiesService: UtilitiesService,
    private assessmentService: AssessmentService,
    private answerService: AnswerService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  public get student(): StudentTableData { return this.rowData as StudentTableData; }
  public get questionSets(): QuestionSet[] { return this.itemSets as QuestionSet[]; }
  public get assessments(): AssessmentTableData[] { return this.itemSets as AssessmentTableData[]; }
  public get items(): Question[] | AnswerDetails[] {
    if (this.questionSets?.length && this.questionSets[this.setIndex]?.questions?.length) {
      return this.questionSets[this.setIndex].questions;
    } else if (this.assessments?.length && this.assessments[this.setIndex]?.answers?.length) {
      return this.assessments[this.setIndex].answers;
    }
    return [];
  }

  async ngOnInit(): Promise<void> {
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('data')) {
      this.loading = true;
      this.setIndex = 0;
      this.itemIndex = 0;
      this.initData();
    }
  }

  public getSpeedIcon(speed: number, min: number, max: number): string {
    const interval = max - min / 3;
    if (speed <= interval) {
      return 'assets/icons/snail.svg';
    } else if (speed >= interval * 2) {
      return 'assets/icons/cheetah.svg';
    }
    return 'assets/icons/rabbit.svg';
  }

  public openAssignQuestionSetDialog(sameStudent = false): void {
    this.dialog.open(QuestionSetAccessesBuilderComponent, {
      data: {
        studentsList: sameStudent ? [this.rowData] : null,
        assessment: this.data
      }
    });
  }

  public openStudentDetail(): void {
    this.router.navigate([`/students/${this.student.id}`]);
  }

  public getIndicatorColor(percentage: number): string {
    if (!percentage && percentage !== 0) {
      return 'inherit';
    }
    if (percentage < 41) {
      return 'red';
    }
    if (percentage < 70) {
      return 'orange';
    }
    if (percentage < 95) {
      return 'limegreen';
    }
    return 'green';
  }

  public getSELIcon(statement: string): string {
    switch (statement) {
      case 'NOT_REALLY': return 'assets/icons/SEL_faces_notReallyLikeMe.svg';
      case 'A_LITTLE': return 'assets/icons/SEL_faces_aLittleLikeMe.svg';
      case 'A_LOT': return 'assets/icons/SEL_faces_aLotLikeMe.svg';
      default: return '';
    }
  }

  public getPreviewedQuestion(): Question {
    if (this.questionSets?.length && this.questionSets[this.setIndex]?.questions?.length) {
      return this.questionSets[this.setIndex]?.questions[this.itemIndex];
    }
    return this.assessments[this.setIndex]?.answers[this.itemIndex]?.question;
  }

  public updateItemSetIndex(index: number): void {
    this.setIndex = index;
    this.itemIndex = 0;
  }

  public updateItemIndex(action: string): void {
    if (action === 'before') {
      this.itemIndex -= this.itemIndex ? 1 : 0;
    } else {
      this.itemIndex += this.items.length > this.itemIndex + 1 ? 1 : 0;
    }
  }

  private async initData(): Promise<void> {
    switch (this.config) {
      case 'library': await this.initLibraryData(); break;
      case 'questions': await this.initQuestionsData(); break;
      case 'students': await this.initStudentsData(); break;
      default: break;
    }
    this.loading = false;
  }

  private async initLibraryData(): Promise<void> {
    if (this.data?.id) { this.assessmentId = this.data?.id; }
    for await (const questionSet of this.data.question_sets) {
      questionSet.questions = await this.assessmentService.getQuestionsList(
        this.assessmentId?.toString(), questionSet.id.toString()).toPromise();
    }
    this.itemSets = this.data.question_sets;
  }

  private async initQuestionsData(): Promise<void> {
    this.itemSets = [{
      id: this.data?.question_set,
      questions: []
    }];
    if (this.data?.assessment) { this.assessmentId = this.data?.assessment; }

    this.questionSets[this.setIndex].questions.push(await
      this.assessmentService.getQuestionDetails(
        this.assessmentId.toString(),
        this.questionSets[this.setIndex].id.toString(),
        this.data?.id
      ).toPromise()
    );
  }

  private async initStudentsData(): Promise<void> {
    if (this.data?.expandedKey === 'SEL') {
      const assessments = await this.answerService.getAssessmentsAnswers(this.student.id.toString()).toPromise();
      assessments.forEach(assessment => {
        assessment.answers = assessment.answers.filter(answer => answer.question.question_type === 'SEL');
      });
      this.itemSets = assessments;
    } else if (this.data) {
      if (this.data?.id) { this.assessmentId = this.data?.id; }
      this.itemSets = this.data?.question_sets;
      await this.getQuestionSetsQuestionAnswers(this.itemSets as QuestionSet[]);
    }
  }

  private async getQuestionSetsQuestionAnswers(questionSets: QuestionSet[]): Promise<void> {
    await questionSets.forEach(async questionSet => {
      let questions = await this.assessmentService.getQuestionSetQuestions(
        this.data.id.toString(), questionSet.id.toString()).toPromise();
      questions = questions.filter(q => q?.question_type !== 'Social and Emotional Learning');
      questions = await Promise.all(questions.map(async question => {
        const questionDetails = await this.assessmentService.getQuestionDetails(
          this.data.id.toString(),
          questionSet.id.toString(),
          question.id
        ).toPromise();
        question.question_type = question.question_type.toUpperCase();
        return {...question, ...questionDetails};
      }));
      questionSet.questions = questions;
      if (this.config === 'students') {
        await questions.forEach(async question => {
          await this.getStudentAnswerData(questionSet, question);
        });
      }
    });
  }

  private async getStudentAnswerData(questionSet: QuestionSet, question: Question) {
    const studentId = (this.rowData as StudentTableData).id.toString();
    const questionTableData = await this.answerService.getQuestionsAnswersDetails(
      studentId,
      this.data.id.toString(),
      questionSet.id.toString(),
      question.id.toString()
    ).toPromise();
    if (questionTableData) {
      question.speed = parseFloat(questionTableData.student_speed);
    };
  }
}
