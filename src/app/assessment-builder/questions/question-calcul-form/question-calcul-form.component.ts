import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { QuestionFormService } from 'src/app/core/services/question-form.service';

interface DialogData {
  topicId?: string;
  order?: any;
  question?: any;
  toClone?: boolean;
  assessmentId?: string;
  selQuestionOrder?: any;
}

function validateCalcul(form: FormGroup): any {
  const firstValue = form.get('first_value');
  const secondValue = form.get('second_value');
  const operator = form.get('operator');

  if (!firstValue.value || !secondValue.value) {
    return;
  }
  if (operator.value) {
    let answer = 0;
    if (operator.value === 'ADDITION') {
      answer = firstValue.value + secondValue.value;
    } else if (operator.value === 'SUBTRACTION') {
      answer = firstValue.value - secondValue.value;
    } else if (operator.value === 'DIVISION') {
      answer = firstValue.value / secondValue.value;
    } else {
      answer = firstValue.value * secondValue.value;
    }

    if (!Number.isInteger(answer) || answer < 0) {
      firstValue.setErrors({ invalidCalcul: true });
      secondValue.setErrors({ invalidCalcul: true });
    } else {
      firstValue.setErrors(null);
      secondValue.setErrors(null);
    }
  }
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
  public difficulties = this.questionFormService.questionDifficulties;

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public attachmentsResetSubject$ = new Subject<void>();

  public operatorTypes = [
    { id: 'ADDITION', path: 'addition' },
    { id: 'SUBTRACTION', path: 'substraction' },
    { id: 'DIVISION', path: 'division' },
    { id: 'MULTIPLICATION', path: 'multiplication' }
  ];

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public calculForm: FormGroup = new FormGroup({
    question_type: new FormControl('CALCUL'),
    title: new FormControl(''),
    order: new FormControl('', [Validators.required]),
    first_value: new FormControl('', [Validators.required, Validators.min(0)]),
    second_value: new FormControl('', [Validators.required, Validators.min(0)]),
    operator: new FormControl('', [Validators.required]),
    difficulty: new FormControl('', [Validators.required]),
    on_popup: new FormControl(false)
  }, validateCalcul);

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
    });
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
      on_popup: question.on_popup,
      difficulty: question.difficulty
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
