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

const validateNumberLine: any = (form: FormGroup) => {
  const start = form.get('start');
  const end = form.get('end');
  const step = form.get('step');
  const expectedVal = form.get('expected_value');

  if (!start.value || !end.value) {
    return;
  }
  if (start.value > end.value - 1) {
    end.setErrors({ startGreaterThanEnd: true });
  }
  if (step.value) {
    const stepsNb = (end.value - start.value) / step.value;

    if (!Number.isInteger(stepsNb)) {
      step.setErrors({ invalidStep: true });
    }
    if (stepsNb > 10) {
      step.setErrors({ tooManySteps: true });
    }
    if (expectedVal.value) {
      if (expectedVal.value < start || expectedVal.value > end) {
        expectedVal.setErrors({ expectedValueOutOfBounds: true });
      }
      if ((expectedVal.value - start.value) % step.value !== 0) {
        expectedVal.setErrors({ expectedValueNotOnStep: true });
      }
    }
  }
};

@Component({
  selector: 'app-question-numberline-form',
  templateUrl: './question-numberline-form.component.html',
  styleUrls: ['./question-numberline-form.component.scss']
})
export class QuestionNumberlineFormComponent implements OnInit {
  public questionsList: any;
  public selectQuestion: boolean;
  public selQuestionOrder: any;

  public assessmentId: string;
  public questionSetId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public attachmentsResetSubject$ = new Subject<void>();
  public questionPreview: any;

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public numberLineForm: FormGroup = new FormGroup({
    question_type: new FormControl('NUMBER_LINE'),
    title: new FormControl(''),
    order: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required, Validators.max(9999)]),
    end: new FormControl('', [Validators.required, Validators.max(10000)]),
    step: new FormControl('', [Validators.required, Validators.min(1)]),
    expected_value: new FormControl('', [Validators.required]),
    shuffle: new FormControl(false, [Validators.required])
  }, validateNumberLine);

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
      this.numberLineForm.controls.order.setValidators([Validators.required, Validators.min(this.selQuestionOrder)]);
    }
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.numberLineForm.controls.order.setValue(this.order);
      await this.questionFormService.getQuestionsTypeList('NUMBER_LINE').then(res => {
        this.questionsList = res;
      });
    }

    this.numberLineForm.valueChanges.subscribe(() => {
      this.setQuestionPreview();
    });

    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.numberLineForm.value,
      questionSetId: this.questionSetId.toString(),
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

  public onAttachmentsChange(file: any, type: string): void{
    this.numberLineForm.markAsDirty();
    if (type === 'image') {
      this.questionFormService.imageAttachment = file;
    } else {
      this.questionFormService.audioAttachment = file;
    }
  this.setQuestionPreview();
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
    this.attachmentsResetSubject$.next();
  }

  private setQuestionPreview(): void {
    const attachments = [];
    if (this.questionFormService.imageAttachment || this.imageAttachment) {
      attachments.push({
        file: this.questionFormService.imageAttachment ?? this.imageAttachment,
        attachment_type: 'IMAGE'
      });
    }
    if (this.questionFormService.audioAttachment || this.audioAttachment) {
      attachments.push({
        file: this.questionFormService.audioAttachment || this.audioAttachment,
        attachment_type: 'AUDIO'
      });
    }

    this.questionPreview = { ...this.numberLineForm.value, attachments };
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
      expected_value: question.expected_value,
      shuffle: question.shuffle,
    });

    await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
      this.imageAttachment = res.image;
      this.audioAttachment = res.audio;
    });

    this.setQuestionPreview();

    if (this.toClone) {
      this.numberLineForm.markAsDirty();
    }
  }
}
