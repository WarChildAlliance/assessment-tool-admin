import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionFormService } from 'src/app/core/services/question-form.service';
import { LanguageService } from 'src/app/core/services/language.service';


interface DialogData {
  questionSetId?: string;
  order?: any;
  question?: any;
  toClone?: boolean;
  assessmentId?: string;
  selQuestionOrder?: any;
}

@Component({
  selector: 'app-question-input-form',
  templateUrl: './question-input-form.component.html',
  styleUrls: ['./question-input-form.component.scss'],
})
export class QuestionInputFormComponent implements OnInit {
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

  public attachmentsResetSubject$ = new Subject<void>();

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public inputForm: FormGroup = new FormGroup({
    question_type: new FormControl('INPUT'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    valid_answer: new FormControl('', [Validators.required])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public questionFormService: QuestionFormService,
    public languageService: LanguageService,
  ) {
    this.attachmentsResetSubject$.subscribe(() => this.questionFormService.resetAttachments());
  }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.questionSetId) { this.questionSetId = this.data.questionSetId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.data?.selQuestionOrder) {
      this.selQuestionOrder = this.data.selQuestionOrder + 1;
      this.inputForm.controls.order.setValidators([Validators.required, Validators.min(this.selQuestionOrder)]);
    }
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.inputForm.controls.order.setValue(this.order);
      await this.questionFormService.getQuestionsTypeList('INPUT').then(res => {
        this.questionsList = res;
      });
    }
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
  }



  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.inputForm.value,
      questionSetId: this.questionSetId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && !this.toClone) {
      this.editInputQuestion(data);
    } else {
      this.createInputQuestion(data);
    }
  }

  public onSelectQuestion(): void {
    const question = this.selectQuestionForm.controls.question.value;
    this.toClone = true;
    this.setForm(question);
  }

  private createInputQuestion(data?: any): void {
    this.questionFormService.createQuestion(data).then(() => {
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
      if (!this.toClone) {
        this.resetForm();
      }
    });
  }

  private editInputQuestion(data?: any): void {
    this.questionFormService.editQuestion(data).then(() => {
      this.questionFormService.emitMessage(false, false);
      this.resetForm();
    });
  }

  private resetForm(): void {
    this.inputForm.controls['order'.toString()].setValue(this.order + 1);
    this.inputForm.controls.question_type.setValue('INPUT');
    this.attachmentsResetSubject$.next();
  }

  private async setForm(question: any): Promise<void> {
    this.selectQuestion = false;
    this.question = question;

    this.inputForm.setValue({
      question_type: 'INPUT',
      title: question.title,
      order: this.toClone ? this.order : question.order,
      valid_answer: question.valid_answer,
    });

    await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
      this.imageAttachment = res.image;
      this.audioAttachment = res.audio;
    });

    if (this.toClone) {
      this.inputForm.markAsDirty();
    }
  }
}
