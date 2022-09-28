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
import { QuestionSelFormComponent } from '../questions/question-sel-form/question-sel-form.component';
import { TopicFormDialogComponent } from '../topic-form-dialog/topic-form-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  public isAnswered = false;

  public reorder = false;
  public changedOrder = false;
  public questionsToOrder: any[] = [];

  private quesionSEL = {
    type: 'SEL',
    text: 'SEL (Social and Emotional Learning)',
    component: QuestionSelFormComponent
  };

  public questionsArray: any[] = [
    {
    type: 'SELECT',
    text: 'Select',
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
  public selQuestionsCount: number;

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
      this.getTopicDetails(true);
    });
    this.getIsDownloadable();
  }

  private getQuestionsList(): void {
    this.assessmentService.getQuestionsList(this.assessmentId, this.topicId).subscribe(questionList => {
      this.questionsList = questionList;
      this.order = questionList.length
        ? questionList.sort((a, b) => parseFloat(a.order) - parseFloat(b.order))[questionList.length - 1].order + 1
        : 1;
      this.isAnswered = questionList.some(question => question.answered);
      this.selQuestionsCount = this.questionsList.filter(question => question.question_type === 'SEL').length;
    });
  }

  private getTopicDetails(initComponent?: boolean): void {
    this.assessmentService.getTopicDetails(this.assessmentId, this.topicId).subscribe(topicDetails => {
      this.topicDetails = topicDetails;
      if (initComponent && this.topicDetails.sel_question) {
        // Adds SEL Question type to the 'Add a question' section
        this.questionsArray.unshift(this.quesionSEL);
      }
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
        assessmentId: this.assessmentId,
        selQuestionOrder: this.selQuestionsCount
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
        title: this.translateService.instant('general.delete', {
          type: this.translateService.instant('general.topic').toLocaleLowerCase()
        }),
        content: this.translateService.instant('general.simpleDeletePrompt', {
          type: this.translateService.instant('general.topic').toLocaleLowerCase(),
          name: this.topicDetails.name
        }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteTopic(this.assessmentId, this.topicId).subscribe(() => {
          this.alertService.success(this.translateService.instant('general.deleteSuccess', {
            type:  this.translateService.instant('general.topic')
          }));
          this.router.navigate(['/assessment-builder/your-assessments']);
        });
      }
    });
  }

  public deleteQuestion(questionId: string, questionTitle: string): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('general.delete', {
          type: this.translateService.instant('general.question').toLocaleLowerCase()
        }),
        content: this.translateService.instant('general.simpleDeletePrompt', {
          type: this.translateService.instant('general.question').toLocaleLowerCase(),
          name: questionTitle
        }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteQuestion(this.assessmentId, this.topicId, questionId).subscribe(() => {
          this.alertService.success(this.translateService.instant('general.deleteSuccess', {
            type:  this.translateService.instant('general.question')
          }));
          this.getQuestionsList();
        });
      }
    });
  }

  public downloadPDF(assessmentId: string, topicId: string, questionId?: string): void {
    this.assessmentService.downloadPDF(assessmentId, topicId, questionId);
  }

  // Start and save reorder questions by drag&drop
  public reorderQuestions(save: boolean): void {
    if (!save) {
      this.reorder = true;
      // Deep copy to avoid modifying both arrays
      this.questionsToOrder = [...this.questionsList];
    } else {
      if (this.changedOrder) {
        // If has SEL questions checks if they are at the beginning
        if (this.topicDetails.sel_question) {
          const breakCondition = this.questionsList.some((question, index) =>
            (question.question_type === 'SEL' && index > this.selQuestionsCount)
            || (question.question_type !== 'SEL' && index < this.selQuestionsCount)
          );

          if (breakCondition) {
            this.alertService.error(this.translateService.instant('assessmentBuilder.topicDetails.selQuestionsOrder'));
            return;
          }
        }
        const data = {
          questions: [],
          assessment_topic: this.topicId
        };

        this.questionsList.forEach(question => {
          data.questions.push(question.id);
        });

        this.assessmentService.reorderQuestions(this.assessmentId, this.topicId, data).subscribe(() => {
          this.getQuestionsList();
          this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentSummary.orderChanged'));
        });
      }
      this.reorder = false;
      this.changedOrder = false;
    }
  }

  // To reorder the questions in the question list after drop
  public dropQuestion(event: CdkDragDrop<object[]>): void {
    moveItemInArray(this.questionsList, event.previousIndex, event.currentIndex);
    this.changedOrder = true;
  }

  // Go back to previous order
  public cancelReorder(): void {
    this.questionsList = this.questionsToOrder;
    this.reorder = false;
  }
}
