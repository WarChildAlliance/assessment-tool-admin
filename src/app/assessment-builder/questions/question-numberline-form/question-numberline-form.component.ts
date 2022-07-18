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

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public attachmentsResetSubject$ = new Subject<void>();

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
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
    if (this.question) {
      this.numberLineForm.setValue({
        question_type: 'NUMBER_LINE',
        title: this.question.title,
        order: this.toClone ? this.order : this.question.order,
        start: this.question.start,
        end: this.question.end,
        step: this.question.step,
        tick_step: this.question.tick_step,
        expected_value: this.question.expected_value,
        show_ticks: this.question.show_ticks,
        show_value: this.question.show_value,
        on_popup: this.question.on_popup
      });

      await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
        this.imageAttachment = res.image;
        this.audioAttachment = res.audio;
      });

      if (this.toClone) {
        this.numberLineForm.markAsDirty();
      }
    } else {
      this.numberLineForm.setValue({
        question_type: 'NUMBER_LINE',
        title: '',
        order: this.order,
        start: null,
        end: null,
        step: null,
        tick_step: null,
        expected_value: null,
        show_ticks: false,
        show_value: false,
        on_popup: false
      });
    }
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
}
