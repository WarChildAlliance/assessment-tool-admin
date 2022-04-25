import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-select-form',
  templateUrl: './question-select-form.component.html',
  styleUrls: ['./question-select-form.component.scss'],
})
export class QuestionSelectFormComponent implements OnInit {
  @Input() assessmentId;
  @Input() topicId;
  @Input() order;
  @Input() question;
  @Input() toClone;

  @Output() questionCreatedEvent = new EventEmitter<boolean>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  @ViewChild('fileInput') el: ElementRef;

  public options = [];
  private optionsAtt = [];

  public imageAttachment = null;
  public audioAttachment = null;

  public changedAudio = false;
  public changedImage = false;
  private optionAttChange = false;

  public optionsAttachment = false;
  public optionsAttachmentEdit = [];
  public type: string;
  public attachment: File;

  public alertMessage = '';

  public saveOptions = false;

  public selectForm: FormGroup = new FormGroup({
    question_type: new FormControl('SELECT'),
    title: new FormControl(''),
    value: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    display: new FormControl('Grid', [Validators.required]),
    multiple: new FormControl(false),
    options: new FormArray([
      this.formBuilder.group({
        title: new FormControl(''),
        valid: new FormControl(false),
        value: new FormControl('', [Validators.required]),
      }),
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private assessmentService: AssessmentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const optionsForm = this.selectForm.get('options') as FormArray;
    if (this.question) {
      this.setExistingAttachments();

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
        display: q.display_type ? q.display_type : 'Grid',
        multiple: q.multiple,
        options,
      });
    } else {
      this.selectForm.setValue({
        question_type: 'SELECT',
        value: '',
        title: '',
        order: this.order, display: 'Grid',
        multiple: false,
        options: [{ title: '', valid: false, value: '' }],
      });
      this.optionsAtt.push({ attachments: [] });
    }
    optionsForm.valueChanges.subscribe((data) => {
      this.options = data;
    });
  }

  addOptions(): void {
    this.optionsAtt.push({ attachments: [] });
    const formGroup: FormGroup = this.formBuilder.group({
      title: this.formBuilder.control(null),
      valid: this.formBuilder.control(false),
      value: this.formBuilder.control(null),
    });
    (this.selectForm.controls.options as FormArray).push(formGroup);
    this.saveOptions = true;
  }

  onSave(): void {
    if (this.toClone) {
      this.createQuestion();
      this.alertMessage = 'Question successfully cloned';
    } else if (this.question && !this.toClone) {
      this.editQuestion();
      this.alertMessage = 'Question successfully updated';
    } else {
      this.createQuestion();
      this.alertMessage = 'Question successfully created';
    }
  }

  createQuestion(): void {
    this.assessmentService
      .createQuestion(
        this.selectForm.value,
        this.topicId.toString(),
        this.assessmentId.toString()
      )
      .subscribe((res) => {
        if (this.imageAttachment) {
          this.saveAttachments(
            this.assessmentId,
            this.imageAttachment,
            'IMAGE',
            { name: 'question', value: res.id }
          );
        }
        if (this.audioAttachment) {
          this.saveAttachments(
            this.assessmentId,
            this.audioAttachment,
            'AUDIO',
            { name: 'question', value: res.id }
          );
        }
        if (this.optionsAttachment) {
          this.saveOptionsAttachments(res);
        }
        this.alertService.success(this.alertMessage);
        this.questionCreatedEvent.emit(true);
      });
  }

  editQuestion(): void {
    this.assessmentService
      .editQuestion(
        this.assessmentId.toString(),
        this.topicId.toString(),
        this.question.id,
        this.selectForm.value
      )
      .subscribe((res) => {
        if (this.changedImage && this.imageAttachment) {
          const image = this.question.attachments.find(
            (i) => i.attachment_type === 'IMAGE'
          );
          this.assessmentService
            .updateAttachments(
              this.assessmentId,
              this.imageAttachment,
              'IMAGE',
              image.id
            )
            .subscribe();
        }
        if (this.changedAudio && this.audioAttachment) {
          const audio = this.question.attachments.find(
            (a) => a.attachment_type === 'AUDIO'
          );
          this.assessmentService
            .updateAttachments(
              this.assessmentId,
              this.audioAttachment,
              'AUDIO',
              audio.id
            )
            .subscribe();
        }
        if (this.optionAttChange && this.optionsAttachment) {
          this.updateOptionsAttachments(res);
        } else {
          this.alertService.success(this.alertMessage);
          this.questionCreatedEvent.emit(true);
          this.closeModalEvent.emit(true);
        }
      });
  }

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService
      .addAttachments(assessmentId, attachment, type, obj)
      .subscribe(() => {
        this.alertService.success(this.alertMessage);
      });
  }

  saveOptionsAttachments(question): void {
    this.optionsAtt.forEach((o, index) => {
      if (o.attachments.length) {
        o.attachments.forEach((att) => {
          if (att.attachment_type === 'IMAGE') {
            this.assessmentService
              .addAttachments(this.assessmentId.toString(), att.file, 'IMAGE', {
                name: 'select_option',
                value: question.options[index].id,
              })
              .subscribe();
          }
          if (att.attachment_type === 'AUDIO') {
            this.assessmentService
              .addAttachments(this.assessmentId.toString(), att.file, 'AUDIO', {
                name: 'select_option',
                value: question.options[index].id,
              })
              .subscribe();
          }
        });
      }
    });
  }

  updateOptionsAttachments(question): void {
    this.optionsAtt.forEach((o, index) => {
      if (o.attachments.length) {
        o.attachments.forEach((att) => {
          if (att.attachment_type === 'IMAGE') {
            if (att.overwritePrevious === true) {
              this.assessmentService
                .updateAttachments(
                  this.assessmentId.toString(),
                  att.file,
                  'IMAGE',
                  att.id
                )
                .subscribe();
            } else if (att.overwritePrevious === false) {
              this.assessmentService
                .addAttachments(
                  this.assessmentId.toString(),
                  att.file,
                  'IMAGE',
                  { name: 'select_option', value: question.options[index].id }
                )
                .subscribe();
            }
          }
          if (att.attachment_type === 'AUDIO') {
            if (att.overwritePrevious === true) {
              this.assessmentService
                .updateAttachments(
                  this.assessmentId.toString(),
                  att.file,
                  'AUDIO',
                  att.id
                )
                .subscribe();
            } else if (att.overwritePrevious === false) {
              this.assessmentService
                .addAttachments(
                  this.assessmentId.toString(),
                  att.file,
                  'AUDIO',
                  { name: 'select_option', value: question.options[index].id }
                )
                .subscribe();
            }
          }
        });
      }
    });
  }

  handleFileInput(event, type): void {
    if (type === 'IMAGE') {
      this.changedImage = true;
      this.imageAttachment = event.target.files[0];
    } else if (type === 'AUDIO') {
      this.changedAudio = true;
      this.audioAttachment = event.target.files[0];
    }
  }

  handleFileInputOptions(event, type, i): void {
    let overwritePrevious = false;
    let id = 0;
    if (type === 'IMAGE') {
      overwritePrevious = this.optionsAttachmentEdit[i]?.image ? true : false;
      id = this.question
        ? this.question.options[i].attachments.find(
            (a) => a.attachment_type === 'IMAGE'
          )?.id
        : i;
      this.imageAttachment = event.target.files[0];
    }
    if (type === 'AUDIO') {
      overwritePrevious = this.optionsAttachmentEdit[i]?.audio ? true : false;
      id = this.question
        ? this.question.options[i].attachments.find(
            (a) => a.attachment_type === 'AUDIO'
          )?.id
        : i;
      this.audioAttachment = event.target.files[0];
    }
    this.optionsAtt[i].attachments.push({
      attachment_type: type,
      file: event.target.files[0],
      overwritePrevious,
      id,
    });
    this.optionAttChange = true;
    this.optionsAttachment = true;
  }

  setExistingAttachments(): void {
    const image = this.question.attachments.find(
      (i) => i.attachment_type === 'IMAGE'
    );
    const audio = this.question.attachments.find(
      (a) => a.attachment_type === 'AUDIO'
    );
    this.imageAttachment = image;
    this.audioAttachment = audio;
    if (this.imageAttachment) {
      this.imageAttachment.name = image ? image.file.split('/').at(-1) : null;
    }
    if (this.audioAttachment) {
      this.audioAttachment.name = audio ? audio.file.split('/').at(-1) : null;
    }
  }

  addRecordedAudio(event): void {
    const name = 'recording_' + new Date().toISOString() + '.wav';
    this.audioAttachment = this.blobToFile(event, name);
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
  }
}
