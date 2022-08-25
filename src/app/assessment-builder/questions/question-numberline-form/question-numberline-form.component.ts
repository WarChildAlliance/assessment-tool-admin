import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionFormService } from 'src/app/core/services/question-form.service';

interface DialogData {
  topicId?: string;
  order?: any;
  question?: any;
  toClone?: boolean;
  assessmentId?: string;
}

@Component({
  selector: 'app-question-numberline-form',
  templateUrl: './question-numberline-form.component.html',
  styleUrls: ['./question-numberline-form.component.scss']
})
export class QuestionNumberlineFormComponent implements OnInit {
  public questionsList: any;
  public selectQuestion: boolean;

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

  public numberLineForm: FormGroup = new FormGroup({
    question_type: new FormControl('NUMBER_LINE'),
    title: new FormControl(''),
    order: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    step: new FormControl('', [Validators.required]),
    tick_step: new FormControl('', [Validators.required]),
    expected_value: new FormControl('', [Validators.required]),
    show_ticks: new FormControl(false),
    show_value: new FormControl(false),
    on_popup: new FormControl(false)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public questionFormService: QuestionFormService
  ) {
    this.attachmentsResetSubject$.subscribe(() => this.questionFormService.resetAttachments());
  }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.numberLineForm.controls.order.setValue(this.order);
      await this.questionFormService.getQuestionsTypeList('NUMBER_LINE').then(res => {
        this.questionsList = res;
      });
    }
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
  }

  private createNumberLineQuestion(data: any): void {
    this.questionFormService.createQuestion(data).then(() => {
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
      if (!this.toClone) {
        this.resetForm();
      }
    });
  }

  private editNumberLineQuestion(data: any): void {
    this.questionFormService.editQuestion(data).then(() => {
      this.questionFormService.emitMessage(false, false);
    });
  }

  private resetForm(): void {
    this.numberLineForm.controls['order'.toString()].setValue(this.order + 1);
    this.numberLineForm.controls.question_type.setValue('NUMBER_LINE');
    this.numberLineForm.controls.show_ticks.setValue(false);
    this.numberLineForm.controls.show_value.setValue(false);
    this.attachmentsResetSubject$.next();
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.numberLineForm.value,
      topicId: this.topicId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && !this.toClone) {
      this.editNumberLineQuestion(data);
    } else {
      this.createNumberLineQuestion(data);
    }
  }

  public onSelectQuestion(): void {
    const question = this.selectQuestionForm.controls.question.value;
    this.toClone = true;
    this.setForm(question);
  }

  private async setForm(question: any): Promise<void> {
    this.selectQuestion = false;
    this.question = question;

    this.numberLineForm.setValue({
      question_type: 'NUMBER_LINE',
      title: question.title,
      order: this.toClone ? this.order : question.order,
      start: question.start,
      end: question.end,
      step: question.step,
      tick_step: question.tick_step,
      expected_value: question.expected_value,
      show_ticks: question.show_ticks,
      show_value: question.show_value,
      on_popup: question.on_popup
    });

    await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
      this.imageAttachment = res.image;
      this.audioAttachment = res.audio;
    });

    if (this.toClone) {
      this.numberLineForm.markAsDirty();
    }
  }
}
