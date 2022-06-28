import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { QuestionDragAndDropFormComponent } from '../questions/question-drag-and-drop-form/question-drag-and-drop-form.component';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { QuestionInputFormComponent } from '../questions/question-input-form/question-input-form.component';
import { QuestionNumberlineFormComponent } from '../questions/question-numberline-form/question-numberline-form.component';
import { QuestionSelectFormComponent } from '../questions/question-select-form/question-select-form.component';
import { TopicFormDialogComponent } from '../topic-form-dialog/topic-form-dialog.component';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss']
})

export class TopicDetailsComponent implements OnInit {

  public assessmentId: string;
  public topicId: string;
  public assessmentType: string;
  public topic: any;

  public isDownloadable = false;

  public questionsArray: any[] = [
    {
    type: 'SELECT',
    text: '(Multi-)Select',
    component: QuestionSelectFormComponent
    },
    {
    type: 'INPUT',
    text: 'Input',
    component: QuestionInputFormComponent
    },
    {
    type: 'NUMBER_LINE',
    text: 'Number Line',
    component: QuestionNumberlineFormComponent
    },
    {
      type: 'DRAG_AND_DROP',
      text: 'Drag and Drop',
      component: QuestionDragAndDropFormComponent
    },
];

  public order: number;

  public questionsList: any[];
  public topicDetails: any;

  constructor(
    private dialog: MatDialog,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.assessmentId = params.assessment_id;
      this.topicId = params.topic_id;
      this.assessmentType = params.type;
      this.getQuestionsList();
      this.getTopicDetails();
    });
    this.getIsDownloadable();
  }

  private getQuestionsList(): void {
    this.assessmentService.getQuestionsList(this.assessmentId, this.topicId).subscribe(questionList => {
      if (questionList.length) {
        this.questionsList = questionList;
        this.order = questionList.sort((a, b) => parseFloat(a.order) - parseFloat(b.order))[questionList.length - 1].order + 1;
      } else {
        this.order = 1;
      }
    });
  }

  private getTopicDetails(): void {
    this.assessmentService.getTopicDetails(this.assessmentId, this.topicId).subscribe(topicDetails => {
      this.topicDetails = topicDetails;
    });
  }

  private getIsDownloadable(): void {
    this.assessmentService.getAssessmentDetails(this.assessmentId).subscribe((assessmentDetails) => {
      this.isDownloadable = assessmentDetails.downloadable;
    });
  }

  public openEditTopicDialog(topic): void {
    this.topic = topic;
    const createTopicDialog = this.dialog.open(TopicFormDialogComponent, {
      data: {
        assessmentId: this.assessmentId,
        edit: true,
        topic: this.topic
      }
    });
    createTopicDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getTopicDetails();
      }
    });
  }

  public openQuestionDialog(question?: any, clone?: boolean, type?: string): void {
    const questionType = question ? question.question_type : type;
    // Use question array to open the dialog corresponding to the question type, using the component attribute
    const questionDialog = this.dialog.open(this.questionsArray.find(x => (questionType === x.type)).component, {
      data: {
        topicId: this.topicId,
        order: this.order,
        question: question ?? null,
        toClone: clone ? true : false,
        assessmentId: this.assessmentId
      }
    });
    questionDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getQuestionsList();
      }
    });
  }

  public deleteTopic(): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('assessmentBuilder.assessmentSummary.deleteTopic'),
        content: this.translateService.instant(
          'assessmentBuilder.assessmentSummary.deleteTopicPrompt', { topicTitle: this.topicDetails.name }
        ),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteTopic(this.assessmentId, this.topicId).subscribe(() => {
          this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentSummary.topicDetailSuccess'));
          this.router.navigate(['/assessment-builder/your-assessments']);
        });
      }
    });
  }

  public deleteQuestion(questionId: string, questionTitle: string): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('assessmentBuilder.topicDetails.deleteQuestion'),
        content: this.translateService.instant('assessmentBuilder.topicDetails.deleteQuestionPrompt', {questionTitle}),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteQuestion(this.assessmentId, this.topicId, questionId).subscribe(() => {
          this.alertService.success(
            this.translateService.instant('assessmentBuilder.topicDetails.deleteQuestionSuccess')
          );
          this.getQuestionsList();
        });
      }
    });
  }

  public downloadPDF(assessmentId: string, topicId: string, questionId?: string): void {
    this.assessmentService.downloadPDF(assessmentId, topicId, questionId);
  }
}
