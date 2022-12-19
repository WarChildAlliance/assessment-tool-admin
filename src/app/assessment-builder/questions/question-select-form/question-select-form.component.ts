import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionFormService } from 'src/app/core/services/question-form.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
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
  selector: 'app-question-select-form',
  templateUrl: './question-select-form.component.html',
  styleUrls: ['./question-select-form.component.scss'],
})
export class QuestionSelectFormComponent implements OnInit {

  @ViewChild('fileInput') el: ElementRef;

  public questionsList: any;
  public selectQuestion: boolean;

  public assessmentId: string;
  public questionSetId: string;
  public order: any;
  public question: any;
  public toClone: boolean;
  public selQuestionOrder: any;

  public options = [];

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public optionsAttachment = false;
  public selectedOption = -1;

  public saveOptions = false;
  public attachmentsResetSubject$ = new Subject<void>();

  public questionPreview: any;

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  // In case of using display_type again: uncomment all occurences of selectForm.controls.display for this component
  public selectForm: FormGroup = new FormGroup({
    question_type: new FormControl('SELECT'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    show_options_title: new FormControl(true, [Validators.required]),
    shuffle: new FormControl(false, [Validators.required]),
    // display: new FormControl('Grid', [Validators.required]),
    options: new FormArray([
      this.formBuilder.group({
        title: new FormControl(''),
        valid: new FormControl(false),
      }),
    ], [Validators.required]),
  });

  private optionsAtt = [];
  private optionsForm: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public questionFormService: QuestionFormService,
    public languageService: LanguageService,
    private alertService: AlertService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<QuestionSelectFormComponent>
  ) {
    this.attachmentsResetSubject$.subscribe(() => this.questionFormService.resetAttachments());
  }

  public get optionsLength(): number {
    const formArray = this.selectForm.controls.options as FormArray;
    return formArray.length;
  }

  public get checkValidAnswer(): boolean {
    return this.optionsForm.value.filter(options => options.valid).length === 1;
  }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.questionSetId) { this.questionSetId = this.data.questionSetId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.data?.selQuestionOrder) {
      this.selQuestionOrder = this.data.selQuestionOrder + 1;
      this.selectForm.controls.order.setValidators([Validators.required, Validators.min(this.selQuestionOrder)]);
    }
    this.optionsForm = this.selectForm.get('options') as FormArray;
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.selectForm.setValue({
        question_type: 'SELECT',
        title: '',
        show_options_title: true,
        shuffle: false,
        order: this.order, //  display: 'Grid',
        options: [{ title: '', valid: false }],
      });
      this.optionsAtt.push({ attachments: [] });

      await this.questionFormService.getQuestionsTypeList('SELECT').then(res => {
        this.questionsList = res;
      });
    }
    this.optionsForm.valueChanges.subscribe((data) => {
      this.options = data;
    });

    this.selectForm.valueChanges.subscribe(() => {
      this.setQuestionPreview();
    });

    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
  }

  public addOptions(): void {
    this.optionsAtt.push({ attachments: [] });
    const formGroup: FormGroup = this.formBuilder.group({
      title: this.formBuilder.control(null),
      valid: this.formBuilder.control(false),
    });
    (this.selectForm.controls.options as FormArray).push(formGroup);
    this.saveOptions = true;
  }

  public deleteOption(index: number): void{
    this.optionsAtt.splice(index, 1);
    const formArray = this.selectForm.controls.options as FormArray;
    formArray.removeAt(index);
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.selectForm.value,
      questionSetId: this.questionSetId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.checkValidAnswer) {
      if (this.question && !this.toClone) {
        this.editQuestion(data);
      } else {
        this.createSelectQuestion(data);
      }
      this.dialogRef.close(true);
    } else {
      this.alertService.error(
        this.translateService.instant('assessmentBuilder.questions.select.optionsValidAnswerErrors')
      );
    }
  }

  public handleFileInputOptions(event: File, type, i): void {
    if (this.editQuestion) { this.selectForm.markAsDirty(); }
    let id = 0;
    const image = this.optionsAtt[i].attachments.find(att => att.attachment_type === 'IMAGE');
    if (type === 'IMAGE') {
      id = this.question
        ? this.question.options[i]?.attachments.find((a) => a.attachment_type === 'IMAGE')?.id
        : i;
      if (image) {
        const index = this.optionsAtt[i].attachments.indexOf(image);
        if (event) {
          this.optionsAtt[i].attachments[index] = {
            attachment_type: type,
            file: event,
            id,
          };
        } else {
          this.optionsAtt[i].attachments.splice(index, 1);
        }
      }
    }
    const audio = this.optionsAtt[i].attachments.find(att => att.attachment_type === 'AUDIO');
    if (type === 'AUDIO') {
      id = this.question
        ? this.question.options[i]?.attachments.find((a) => a.attachment_type === 'AUDIO')?.id
        : i;
      if (audio) {
        const index = this.optionsAtt[i].attachments.indexOf(audio);
        if (event) {
          this.optionsAtt[i].attachments[index] = {
            attachment_type: type,
            file: event,
            id
          };
        } else {
          this.optionsAtt[i].attachments.splice(index, 1);
        }
      }
    }
    if ((!audio && type === 'AUDIO') || (!image && type === 'IMAGE')) {
      this.optionsAtt[i].attachments.push({
        attachment_type: type,
        file: event,
        id
      });
    }
    this.optionsAttachment = this.optionsAtt.some(op => op.attachments.length);
    this.setQuestionPreview();
  }

  public async setExistingOptionsAttachments(): Promise<void> {
    await this.question.options.forEach(async (option, i) => {
      const image = option.attachments.find(att => att.attachment_type === 'IMAGE');
      if (image) {
        await this.questionFormService.objectToFile(image).then(file => {
          this.optionsAtt[i].attachments.push({
            attachment_type: 'IMAGE',
            file,
            id: i,
          });
        });
      }

      const audio = option.attachments.find(att => att.attachment_type === 'AUDIO');
      if (audio) {
        await this.questionFormService.objectToFile(audio).then(file => {
          this.optionsAtt[i].attachments.push({
            attachment_type: 'AUDIO',
            file,
            id: i,
          });
        });
      }
    });
    this.optionsAttachment = true;
    this.setQuestionPreview();
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

  public onAttachmentsChange(file: any, type: string): void{
    this.selectForm.markAsDirty();
    if (type === 'image') {
      this.questionFormService.imageAttachment = file;
    } else {
      this.questionFormService.audioAttachment = file;
    }
  this.setQuestionPreview();
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

    this.questionPreview = { ...this.selectForm.value, attachments };
    // Deep clone options object (for some reason the {...} doesn't work)
    this.questionPreview.options = JSON.parse(JSON.stringify(this.selectForm.value.options));

    this.questionPreview.options.forEach((option, i) => {
      option.attachments = this.optionsAtt[i].attachments;
    });
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
      const attObj = {
        audio:
          element.attachments.find((a) => a.attachment_type === 'AUDIO')
            ?.file || null,
        image:
          element.attachments.find((a) => a.attachment_type === 'IMAGE')
            ?.file || null,
      };
      this.optionsAtt.push({ attachments: [] });
      const optOject = {
        valid: element.valid,
        title: element.title,
      };
      options.push(optOject);
      if (element.valid) {
        this.selectedOption = index;
      }
    });

    for (let i = 1; i < options.length; i++) {
      const optionsGroup = this.formBuilder.group({
        valid: new FormControl(null),
        title: new FormControl(null),
      });
      this.optionsForm.push(optionsGroup);
    }

    const q = this.question;
    this.selectForm.setValue({
        question_type: 'SELECT',
        title: q.title,
        order: this.toClone ? this.order : this.question.order,
        show_options_title: q.show_options_title,
        shuffle: q.shuffle,
        // display: q.display_type ? this.displayTypeFormat(q.display_type) : 'Grid',
        options,
      });

    await this.setExistingOptionsAttachments();

    if (this.toClone) {
      this.selectForm.markAsDirty();
    }
  }

  private createSelectQuestion(data?: any): void {
    this.questionFormService.createQuestion(data).then(res => {
      if (this.optionsAttachment) {
        this.saveOptionsAttachments(res);
      }
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
      if (!this.toClone) {
        this.resetForm();
      }
    });
  }

  private editQuestion(data: any): void {
    this.questionFormService.editQuestion(data)
      .then((res) => {
        if (this.optionsAttachment) {
          this.saveOptionsAttachments(res);
        }
        this.questionFormService.emitMessage(false, false);
      });
  }

  private saveOptionsAttachments(question): void {
    this.optionsAtt.forEach((o, index) => {
      if (o.attachments.length) {
        o.attachments.forEach((att) => {
          this.questionFormService.saveAttachments(
            this.assessmentId.toString(),
            att.file,
            att.attachment_type,
            {
              name: 'select_option',
              value: question.options[index].id,
            },
            false
          );
        });
      }
    });
  }

  private resetForm(): void {
    this.selectForm.patchValue({
      question_type: 'SELECT',
      title: '',
      order: this.order, // display: 'Grid',
      show_options_title: true,
      shuffle: false,
      options: [{ title: '', valid: false }],
    });

    this.options = [];
    this.optionsAtt = [{ attachments: [] }];

    this.saveOptions = false;
    this.selectForm.controls.order.setValue(this.order + 1, [Validators.required]);
    // this.selectForm.controls.display.setValue('Grid', [Validators.required]);

    this.attachmentsResetSubject$.next();

    const optionsForm = this.selectForm.get('options') as FormArray;
    optionsForm.clear();
    this.addOptions();
  }

  // TODO: later changes it in backend
  // In case of using display_type again: uncomment following method

  // private displayTypeFormat(str: string): string {
  //   return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  // }
}
