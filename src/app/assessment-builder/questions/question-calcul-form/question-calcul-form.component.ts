import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { QuestionFormService } from 'src/app/core/services/question-form.service';
import { LanguageService } from 'src/app/core/services/language.service';

interface DialogData {
  topicId?: string;
  order?: any;
  question?: any;
  toClone?: boolean;
  assessmentId?: string;
  selQuestionOrder?: any;
}

@Component({
  selector: 'app-question-calcul-form',
  templateUrl: './question-calcul-form.component.html',
  styleUrls: ['./question-calcul-form.component.scss']
})
export class QuestionCalculFormComponent implements OnInit {
  public questionsList: any;
  public selectQuestion: boolean;
  public selQuestionOrder: any;

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public attachmentsResetSubject$ = new Subject<void>();

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public calculForm: FormGroup = new FormGroup({
    question_type: new FormControl('CALCUL'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    first_value: new FormControl('', [Validators.required, Validators.min(0)]),
    second_value: new FormControl('', [Validators.required, Validators.min(0)]),
    operator: new FormControl('', [Validators.required])
  }, this.questionFormService.validateCalcul);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public questionFormService: QuestionFormService,
    public languageService: LanguageService,
  ) {
    this.attachmentsResetSubject$.subscribe(() => this.questionFormService.resetAttachments());
  }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.data?.selQuestionOrder) {
      this.selQuestionOrder = this.data.selQuestionOrder + 1;
      this.calculForm.controls.order.setValidators([Validators.required, Validators.min(this.selQuestionOrder)]);
    }
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.calculForm.controls.order.setValue(this.order);
      await this.questionFormService.getQuestionsTypeList('CALCUL').then(res => {
        this.questionsList = res;
      });
    }
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
  }

  public onSelectQuestion(): void {
    const question = this.selectQuestionForm.controls.question.value;
    this.toClone = true;
    this.setForm(question);
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.calculForm.value,
      topicId: this.topicId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && !this.toClone) {
      this.editCalculQuestion(data);
    } else {
      this.createCalculQuestion(data);
    }
  }

  private createCalculQuestion(data: any): void {
    this.questionFormService.createQuestion(data).then(() => {
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
      if (!this.toClone) {
        this.resetForm();
      }
    });
  }

  private resetForm(): void {
    this.calculForm.controls['order'.toString()].setValue(this.order + 1);
    this.calculForm.controls.question_type.setValue('CALCUL');
    this.attachmentsResetSubject$.next();
  }

  private editCalculQuestion(data: any): void {
    this.questionFormService.editQuestion(data).then(() => {
      this.questionFormService.emitMessage(false, false);
    });
  }

  private async setForm(question: any): Promise<void> {
    this.selectQuestion = false;
    this.question = question;
    this.calculForm.setValue({
      question_type: 'CALCUL',
      title: question.title,
      order: this.toClone ? this.order : question.order,
      first_value: question.first_value,
      second_value: question.second_value,
      operator: question.operator,
    });

    await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
      this.imageAttachment = res.image;
      this.audioAttachment = res.audio;
    });

    if (this.toClone) {
      this.calculForm.markAsDirty();
    }
  }
}
