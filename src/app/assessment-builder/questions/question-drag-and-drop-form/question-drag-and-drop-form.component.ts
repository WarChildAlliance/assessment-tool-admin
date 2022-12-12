import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { QuestionFormService } from 'src/app/core/services/question-form.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

interface DialogData {
  questionSetId?: string;
  order?: any;
  question?: any;
  toClone?: boolean;
  assessmentId?: string;
  selQuestionOrder?: any;
}

@Component({
  selector: 'app-question-drag-and-drop-form',
  templateUrl: './question-drag-and-drop-form.component.html',
  styleUrls: ['./question-drag-and-drop-form.component.scss']
})
export class QuestionDragAndDropFormComponent implements OnInit {
  public questionsList: any;
  public selectQuestion: boolean;

  public assessmentId: string;
  public questionSetId: string;
  public order: any;
  public question: any;
  public toClone: boolean;
  public selQuestionOrder: any;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public questionDetails: FormGroup;

  public questionType: string;
  public dragAndDropType = ['NORMAL', 'CUSTOMIZED'];

  // To dynamically change the steps orientation layout based on the viewport
  public stepperOrientation: Observable<StepperOrientation>;

  public createDraggableOptions$ = new BehaviorSubject<any>(null);
  public attachmentsResetSubject$ = new Subject<void>();

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public dragAndDropForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    order: new FormControl('', Validators.required),
    type: new FormControl('NORMAL', Validators.required)
  });

  // making sure that we don't store an new background image on editQuestion, if attachment didn't change
  public changedBackgroundImage = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private assessmentService: AssessmentService,
    public languageService: LanguageService,
    public questionFormService: QuestionFormService,
    public breakpointObserver: BreakpointObserver
  ) {
    this.attachmentsResetSubject$.subscribe(() => this.questionFormService.resetAttachments());
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.questionSetId) { this.questionSetId = this.data.questionSetId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.data?.selQuestionOrder) {
      this.selQuestionOrder = this.data.selQuestionOrder + 1;
      this.dragAndDropForm.controls.order.setValidators([Validators.required, Validators.min(this.selQuestionOrder)]);
    }
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.dragAndDropForm.controls.order.setValue(this.order);
      await this.questionFormService.getQuestionsTypeList('DRAG_AND_DROP,CUSTOMIZED_DRAG_AND_DROP').then(res => {
        this.questionsList = res;
      });
    }
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.dragAndDropForm.controls.type.value === 'NORMAL'
        ? this.createNormalQuestionForm().value
        : this.createCustomizedQuestionForm().value,
        questionSetId: this.questionSetId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && !this.toClone) {
      this.editDragAndDropQuestion(data);
    } else {
      this.createDragAndDropQuestion(data);
    }
  }

  public onSelectQuestion(): void {
    const question = this.selectQuestionForm.controls.question.value;
    this.toClone = true;
    this.setForm(question);
  }

  private createNormalQuestionForm(): FormGroup {
    return new FormGroup({
      question_type: new FormControl('DRAG_AND_DROP'),
      title: new FormControl(this.dragAndDropForm.controls.title.value),
      order: new FormControl(this.dragAndDropForm.controls.order.value),
      drop_areas: new FormControl(this.questionDetails.controls.drop_areas.value)
    });
  }

  private createCustomizedQuestionForm(): FormGroup {
    return new FormGroup({
      question_type: new FormControl('CUSTOMIZED_DRAG_AND_DROP'),
      title: new FormControl(this.dragAndDropForm.controls.title.value),
      order: new FormControl(this.dragAndDropForm.controls.order.value),
      first_value: new FormControl(this.questionDetails.controls.first_value.value),
      first_style: new FormControl(this.questionDetails.controls.first_style.value),
      second_value: new FormControl(this.questionDetails.controls.second_value.value),
      second_style: new FormControl(this.questionDetails.controls.second_style.value),
      operator: new FormControl(this.questionDetails.controls.operator.value),
      shape: new FormControl(this.questionDetails.controls.shape.value)
    });
  }

  private createDragAndDropQuestion(data: any): void {
    this.questionFormService.createQuestion(data).then(questionCreated => {
      if (this.dragAndDropForm.controls.type.value === 'NORMAL') {
        this.questionFormService.saveAttachments(
          this.assessmentId.toString(), this.questionDetails.controls.background_image.value,
          'IMAGE', { name: 'question', value: questionCreated.id, background_image: true }, true
        );

        this.createDraggableOptions$.next(questionCreated);
      }
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
    });
  }

  private editDragAndDropQuestion(data: any): void {
    this.questionFormService.editQuestion(data).then(question => {
      if (this.dragAndDropForm.controls.type.value === 'NORMAL') {
        if (this.changedBackgroundImage) {
          this.questionFormService.updateAttachments(
            this.assessmentId, 'IMAGE', { name: 'question', value: question.id },
            this.questionDetails.controls.background_image.value, true, null, this.question
          );
        }
        this.createDraggableOptions$.next(question);
      }

      this.questionFormService.emitMessage(false, false);
    });
  }

  private async setForm(question: any): Promise<void> {
    this.selectQuestion = false;
    this.question = question;
    this.questionType = this.question.question_type === 'DRAG_AND_DROP' ? 'NORMAL' : 'CUSTOMIZED';

    this.dragAndDropForm.setValue({
      title: this.question.title,
      order: this.toClone ? this.order : this.question.order,
      type: this.questionType
    });

    // Setting existing attachments
    await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
      this.imageAttachment = res.image;
      this.audioAttachment = res.audio;
    });

    if (this.toClone) {
      this.dragAndDropForm.markAsDirty();
    }
  }
}
