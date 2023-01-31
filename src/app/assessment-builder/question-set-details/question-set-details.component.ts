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
import { QuestionSetFormDialogComponent } from '../question-set-form-dialog/question-set-form-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { QuestionDominoFormComponent } from '../questions/question-domino-form/question-domino-form.component';
import { QuestionCalculFormComponent } from '../questions/question-calcul-form/question-calcul-form.component';
import { Assessment } from 'src/app/core/models/assessment.model';

@Component({
  selector: 'app-question-set-details',
  templateUrl: './question-set-details.component.html',
  styleUrls: ['./question-set-details.component.scss']
})

export class QuestionSetDetailsComponent implements OnInit {

  public assessmentId: string;
  public questionSetId: string;
  public assessmentType: string;
  public questionSet: any;
  public learningObj: any;
  public isDownloadable = false;
  // public isAnswered = false;

  public reorder = false;
  public changedOrder = false;
  public questionsToOrder: any[] = [];

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
    {
      type: 'DOMINO',
      text: 'Domino',
      component: QuestionDominoFormComponent
    },
    {
      type: 'CALCUL',
      text: 'Calcul',
      component: QuestionCalculFormComponent
    },
];

  public order: number;
  public selQuestionsCount: number;

  public questionsList: any[];
  public questionSetDetails: any;
  private assessment: Assessment;


  private questionSEL = {
    type: 'SEL',
    text: 'SEL (Social and Emotional Learning)',
    component: QuestionSelFormComponent
  };

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
      this.questionSetId = params.question_set_id;
      this.assessmentType = params.type;
      this.getQuestionsList();
      this.getQuestionSetDetails(true);
      this.getAssessmentDetails();
    });
    this.getIsDownloadable();
  }

  public openEditQuestionSetDialog(questionSet): void {
    this.questionSet = questionSet;
    const editQuestionSetDialog = this.dialog.open(QuestionSetFormDialogComponent, {
      data: {
        assessmentId: this.assessmentId,
        edit: true,
        questionSet: this.questionSet,
        subject: this.assessment.subject.toUpperCase(),
        grade: this.assessment.grade.toString(),
        topic: this.assessment.topic?.id ?? null
      }
    });
    editQuestionSetDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getQuestionSetDetails();
      }
    });
  }

  public openQuestionDialog(question?: any, clone?: boolean, type?: string): void {
    let questionType = question ? question.question_type : type;
    if (questionType === 'CUSTOMIZED_DRAG_AND_DROP') { questionType = 'DRAG_AND_DROP'; }
    // Use question array to open the dialog corresponding to the question type, using the component attribute
    const questionDialog = this.dialog.open(this.questionsArray.find(x => (questionType === x.type)).component, {
      data: {
        questionSetId: this.questionSetId,
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

  public deleteQuestionSet(): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('general.delete', {
          type: this.translateService.instant('general.questionSet').toLocaleLowerCase()
        }),
        content: this.translateService.instant('general.simpleDeletePrompt', {
          type: this.translateService.instant('general.questionSet').toLocaleLowerCase(),
          name: this.questionSetDetails.name
        }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteQuestionSet(this.assessmentId, this.questionSetId).subscribe(() => {
          this.alertService.success(this.translateService.instant('general.deleteSuccess', {
            type:  this.translateService.instant('general.questionSet')
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
        this.assessmentService.deleteQuestion(this.assessmentId, this.questionSetId, questionId).subscribe(() => {
          this.alertService.success(this.translateService.instant('general.deleteSuccess', {
            type:  this.translateService.instant('general.question')
          }));
          this.getQuestionsList();
        });
      }
    });
  }

  public downloadPDF(assessmentId: string, questionSetId: string, questionId?: string): void {
    this.assessmentService.downloadPDF(assessmentId, questionSetId, questionId);
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
        if (this.questionSetDetails.sel_question) {
          const breakCondition = this.questionsList.some((question, index) =>
            (question && question.question_type === 'SEL' && index > this.selQuestionsCount)
            || (question && question.question_type !== 'SEL' && index < this.selQuestionsCount)
          );

          if (breakCondition) {
            this.alertService.error(this.translateService.instant('assessmentBuilder.questionSetDetails.selQuestionsOrder'));
            return;
          }
        }
        const data = {
          questions: [],
          assessment_question_set: this.questionSetId
        };

        this.questionsList.forEach(question => {
          data.questions.push(question.id);
        });

        this.assessmentService.reorderQuestions(this.assessmentId, this.questionSetId, data).subscribe(() => {
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

  private getQuestionsList(): void {
    this.assessmentService.getQuestionsList(this.assessmentId, this.questionSetId).subscribe(questionList => {
      this.questionsList = questionList;
      this.order = questionList.length
        ? questionList.sort((a, b) => parseFloat(a.order) - parseFloat(b.order))[questionList.length - 1].order + 1
        : 1;
       // In case of using the logic that prevents to edit if student already answered it again: uncomment the following line
      // this.isAnswered = questionList.some(question => question.answered);
      this.selQuestionsCount = this.questionsList.filter(question => question.question_type === 'SEL').length;
    });
  }

  private getQuestionSetDetails(initComponent?: boolean): void {
    this.assessmentService.getQuestionSetDetails(this.assessmentId, this.questionSetId).subscribe(questionSetDetails => {
      const savedLanguage = localStorage.getItem('la-language') || 'eng';
      this.questionSetDetails = questionSetDetails;
      if (this.questionSetDetails.learning_objective) {
        this.learningObj = this.questionSetDetails.learning_objective;
        this.learningObj.name = this.learningObj[`name_${savedLanguage}`];
      }
      if (initComponent && this.questionSetDetails.sel_question) {        // Adds SEL Question type to the 'Add a question' section
        this.questionsArray.unshift(this.questionSEL);
      }
    });
  }

  private getAssessmentDetails(): void {
    this.assessmentService.getAssessmentDetails(this.assessmentId).subscribe((assessmentDetails: Assessment) => {
      this.assessment = assessmentDetails;
    });
  }

  private getIsDownloadable(): void {
    this.assessmentService.getAssessmentDetails(this.assessmentId).subscribe((assessmentDetails) => {
      this.isDownloadable = assessmentDetails.downloadable;
    });
  }
}
