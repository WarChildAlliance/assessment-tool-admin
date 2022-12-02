import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
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

const validateUniqueAnswer = (form: FormGroup): any => {
  const dominoes = form.get('options');
  const answer = form.get('expected_value');

  if (answer.value) {
    const countCorrect = dominoes.value.filter(domino => {
      if (domino.left_side_value && domino.right_side_value) {
        return domino.left_side_value + domino.right_side_value === answer.value;
      }
      return false;
    }).length;

    if (countCorrect > 1) {
      dominoes.setErrors({ multipleAnswers: true });
    } else {
      dominoes.setErrors(null);
    }
  }
};

@Component({
  selector: 'app-question-domino-form',
  templateUrl: './question-domino-form.component.html',
  styleUrls: ['./question-domino-form.component.scss']
})
export class QuestionDominoFormComponent implements OnInit {
  public questionsList: any;
  public selectQuestion: boolean;
  public selectedOption = -1;

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;
  public selQuestionOrder: any;
  public grade: string;
  public subject: string;
  public subtopicId: number;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;
  public attachmentsResetSubject$ = new Subject<void>();

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public dominoForm: FormGroup = new FormGroup({
    question_type: new FormControl('DOMINO'),
    title: new FormControl(''),
    order: new FormControl('', [Validators.required]),
    expected_value: new FormControl('', [Validators.required]),
    options: new FormArray([]),
  }, validateUniqueAnswer);

  private optionsForm: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public questionFormService: QuestionFormService,
    public languageService: LanguageService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<QuestionDominoFormComponent>
  ) {
    this.attachmentsResetSubject$.subscribe(() => this.questionFormService.resetAttachments());
  }

  private get checkValidAnswer(): boolean {
    return this.optionsForm.value.filter(options => options.valid).length === 1;
  }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.data?.selQuestionOrder) {
      this.selQuestionOrder = this.data.selQuestionOrder + 1;
      this.dominoForm.controls.order.setValidators([Validators.required, Validators.min(this.selQuestionOrder)]);
    }
    this.optionsForm = this.dominoForm.get('options') as FormArray;
    this.createDominoOptions();

    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.dominoForm.controls.order.setValue(this.order);
      await this.questionFormService.getQuestionsTypeList('DOMINO').then(res => {
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


  public checkValid(checkedIndex: number, eventChecked): void {
    if (eventChecked) {
      this.optionsForm.value.forEach((op, i) => {
        if (op.valid && i !== checkedIndex) {
          op.valid = false;
        }
      });
    }
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.dominoForm.value,
      topicId: this.topicId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.checkValidAnswer) {
      if (this.question && !this.toClone) {
        this.editQuestion(data);
      } else {
        this.createDominoQuestion(data);
      }
      this.dialogRef.close(true);
    } else {
      this.alertService.error(
        this.translateService.instant('assessmentBuilder.questions.select.optionsValidAnswerErros')
      );
    }
  }

  private createDominoQuestion(data?: any): void {
    this.questionFormService.createQuestion(data).then(res => {
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
    });
  }

  private editQuestion(data: any): void {
    this.questionFormService.editQuestion(data)
      .then((res) => {
        this.questionFormService.emitMessage(false, false);
      });
  }

  private createDominoOptions(): void {
    // There're always 9 dominoes
    for (let i = 0; i < 9; i++) {
      const optionsGroup = this.formBuilder.group({
        left_side_value: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(6)]),
        right_side_value: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(6)]),
        valid: new FormControl(false),
      });
      this.optionsForm.push(optionsGroup);
    }
  }

  private async setForm(question: any): Promise<void> {
    this.selectQuestion = false;
    this.question = question;

    await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
      this.imageAttachment = res.image;
      this.audioAttachment = res.audio;
    });

    const options = [];
    this.question.options.forEach((element, index) => {
      const optOject = {
        left_side_value: element.left_side_value,
        right_side_value: element.right_side_value,
        valid: element.valid,
      };
      options.push(optOject);

      if (element.valid) {
        this.selectedOption = index;
      }
    });

    const q = this.question;
    this.dominoForm.setValue({
      question_type: 'DOMINO',
      title: q.title,
      expected_value: q.expected_value,
      order: this.toClone ? this.order : q.order,
      options,
    });

    if (this.toClone) {
      this.dominoForm.markAsDirty();
    }
  }
}
