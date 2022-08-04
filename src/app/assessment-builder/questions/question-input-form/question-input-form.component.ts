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
  selector: 'app-question-input-form',
  templateUrl: './question-input-form.component.html',
  styleUrls: ['./question-input-form.component.scss'],
})
export class QuestionInputFormComponent implements OnInit {

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public attachmentsResetSubject$ = new Subject<void>();

  public inputForm: FormGroup = new FormGroup({
    question_type: new FormControl('INPUT'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    valid_answer: new FormControl('', [Validators.required]),
    on_popup: new FormControl(false)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public questionFormService: QuestionFormService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
    if (this.question) {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: this.question.title,
        order: this.toClone ? this.order : this.question.order,
        valid_answer: this.question.valid_answer,
        on_popup: this.question.on_popup
      });

      await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
        this.imageAttachment = res.image;
        this.audioAttachment = res.audio;
      });

      if (this.toClone) {
        this.inputForm.markAsDirty();
      }
    } else {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: '',
        order: this.order,
        valid_answer: '',
        on_popup: false
      });
    }
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

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.inputForm.value,
      topicId: this.topicId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && !this.toClone) {
      this.editInputQuestion(data);
    } else {
      this.createInputQuestion(data);
    }
  }
}
