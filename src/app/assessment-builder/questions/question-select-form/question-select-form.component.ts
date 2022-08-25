import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-question-select-form',
  templateUrl: './question-select-form.component.html',
  styleUrls: ['./question-select-form.component.scss'],
})
export class QuestionSelectFormComponent implements OnInit {

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  @ViewChild('fileInput') el: ElementRef;

  public options = [];

  private optionsAtt = [];
  private optionAttChange = false;

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  public optionsAttachment = false;
  public optionsAttachmentEdit = [];

  public saveOptions = false;
  public attachmentsResetSubject$ = new Subject<void>();

  // In case of using display_type again: uncomment all occurences of selectForm.controls.display for this component
  public selectForm: FormGroup = new FormGroup({
    question_type: new FormControl('SELECT'),
    title: new FormControl(''),
    value: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    // display: new FormControl('Grid', [Validators.required]),
    multiple: new FormControl(false),
    on_popup: new FormControl(false),
    options: new FormArray([
      this.formBuilder.group({
        title: new FormControl(''),
        valid: new FormControl(false),
        value: new FormControl('', [Validators.required]),
      }),
    ]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public questionFormService: QuestionFormService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    const optionsForm = this.selectForm.get('options') as FormArray;
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
    if (this.question) {
      await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
        this.imageAttachment = res.image;
        this.audioAttachment = res.audio;
      });

      const options = [];
      this.question.options.forEach((element) => {
        const attObj = {
          audio:
            element.attachments.find((a) => a.attachment_type === 'AUDIO')
              ?.file || null,
          image:
            element.attachments.find((a) => a.attachment_type === 'IMAGE')
              ?.file || null,
        };
        this.optionsAtt.push({ attachments: [] });
        this.optionsAttachmentEdit.push(attObj);
        const optOject = {
          valid: element.valid,
          title: element.title,
          value: element.value,
        };
        options.push(optOject);
      });

      for (let i = 1; i < options.length; i++) {
        const optionsGroup = this.formBuilder.group({
          valid: new FormControl(null),
          title: new FormControl(null),
          value: new FormControl(null),
        });
        optionsForm.push(optionsGroup);
      }

      const q = this.question;
      this.selectForm.setValue({
        question_type: 'SELECT',
        value: q.value,
        title: q.title,
        order: this.toClone ? this.order : this.question.order,
        // display: q.display_type ? this.displayTypeFormat(q.display_type) : 'Grid',
        multiple: q.multiple,
        on_popup: this.question.on_popup,
        options,
      });
      if (this.toClone) {
        this.selectForm.markAsDirty();
      }
    } else {
      this.selectForm.setValue({
        question_type: 'SELECT',
        value: '',
        title: '',
        order: this.order, //  display: 'Grid',
        multiple: false,
        on_popup: false,
        options: [{ title: '', valid: false, value: '' }],
      });
      this.optionsAtt.push({ attachments: [] });
    }
    optionsForm.valueChanges.subscribe((data) => {
      this.options = data;
    });
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
        if (this.optionAttChange && this.optionsAttachment) {
          this.updateOptionsAttachments(res);
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

  private updateOptionsAttachments(question): void {
    this.optionsAtt.forEach((o, index) => {
      if (o.attachments.length) {
        o.attachments.forEach((att) => {
          if (att.overwritePrevious === true) {
            this.questionFormService.updateAttachments(
              this.assessmentId.toString(),
              att.attachment_type,
              { name: 'select_option', value: att.id },
              att.file,
              false,
              att
            );
          } else if (att.overwritePrevious === false) {
            this.questionFormService.saveAttachments(
              this.assessmentId.toString(),
              att.file,
              att.attachment_type,
              { name: 'select_option', value: question.options[index].id },
              false
            );
          }
        });
      }
    });
  }

  private resetForm(): void {
    this.selectForm.setValue({
      question_type: 'SELECT',
      value: '',
      title: '',
      order: this.order, // display: 'Grid',
      multiple: false,
      on_popup: false,
      options: [{ title: '', valid: false, value: '' }],
    });

    this.options = [];
    this.optionsAtt = [{ attachments: [] }];
    this.optionsAttachmentEdit = [];

    this.optionAttChange = false;
    this.saveOptions = false;
    this.selectForm.controls.order.setValue(this.order + 1, [Validators.required]);
    // this.selectForm.controls.display.setValue('Grid', [Validators.required]);
    this.selectForm.controls.question_type.setValue('SELECT');
    this.selectForm.controls.multiple.setValue(false);

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

  public addOptions(): void {
    this.optionsAtt.push({ attachments: [] });
    const formGroup: FormGroup = this.formBuilder.group({
      title: this.formBuilder.control(null),
      valid: this.formBuilder.control(false),
      value: this.formBuilder.control(null),
    });
    (this.selectForm.controls.options as FormArray).push(formGroup);
    this.saveOptions = true;
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.selectForm.value,
      topicId: this.topicId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && ! this.toClone) {
      this.editQuestion(data);
    } else {
      this.createSelectQuestion(data);
    }
  }

  public handleFileInputOptions(event: File, type, i): void {
    if (this.editQuestion) { this.selectForm.markAsDirty(); }
    let overwritePrevious = false;
    let id = 0;
    if (type === 'IMAGE') {
      overwritePrevious = this.optionsAttachmentEdit[i]?.image ? true : false;
      id = this.question
        ? this.question.options[i].attachments.find(
            (a) => a.attachment_type === 'IMAGE'
          )?.id
        : i;
    }
    if (type === 'AUDIO') {
      overwritePrevious = this.optionsAttachmentEdit[i]?.audio ? true : false;
      id = this.question
        ? this.question.options[i].attachments.find(
            (a) => a.attachment_type === 'AUDIO'
          )?.id
        : i;
    }
    this.optionsAtt[i].attachments.push({
      attachment_type: type,
      file: event,
      overwritePrevious,
      id,
    });
    this.optionAttChange = true;
    this.optionsAttachment = true;
  }
}
