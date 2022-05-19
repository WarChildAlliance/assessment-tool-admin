import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  @Output() questionCreatedEvent = new EventEmitter<boolean>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  public imageAttachment = null;
  public audioAttachment = null;
  // making sure that we dont store an new attachment on editQuestion, if attachment didnt change
  public changedAudio = false;
  public changedImage = false;

  public alertMessage = '';
  public attachmentsResetSubject$ = new Subject<void>();

  public inputForm: FormGroup = new FormGroup({
    question_type: new FormControl('INPUT'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    valid_answer: new FormControl('', [Validators.required]),
  });

  constructor(
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private assessmentService: AssessmentService,
    private alertService: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.question) {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: this.question.title,
        order: this.toClone ? this.order : this.question.order,
        valid_answer: this.question.valid_answer
      });
      await this.setExistingAttachments();
      if (this.toClone) {
        this.inputForm.markAsDirty();
      }
    } else {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: '',
        order: this.order,
        valid_answer: '',
      });
    }
  }

  private createInputQuestion(): void {
    this.assessmentService
      .createQuestion(
        this.inputForm.value,
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
        this.alertService.success(this.alertMessage);
        this.questionCreatedEvent.emit(true);
        if (!this.toClone) {
          this.resetForm();
        }
      });
  }

  private editQuestion(): void {
    this.assessmentService
      .editQuestion(
        this.assessmentId.toString(),
        this.topicId.toString(),
        this.question.id,
        this.inputForm.value
      )
      .subscribe((res) => {
        if (this.imageAttachment && this.changedImage) {
          this.updateQuestionAttachments('IMAGE', res.id, this.imageAttachment);
        }
        if (this.audioAttachment && this.changedAudio) {
          this.updateQuestionAttachments('AUDIO', res.id, this.audioAttachment);
        }
        this.alertService.success(this.alertMessage);
        this.questionCreatedEvent.emit(true);
        if (!this.toClone) {
          this.resetForm();
        }
      });
  }

  private updateQuestionAttachments(type: string, id: any, attachment: any): void {
    const file = this.question.attachments.find(
      (a) => a.attachment_type === type
    );
    if (file) {
      this.assessmentService
        .updateAttachments(this.assessmentId, attachment, type, file.id)
        .subscribe();
    } else {
      this.saveAttachments(this.assessmentId, attachment, type, {
        name: 'question',
        value: id,
      });
    }
  }

  private saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService
      .addAttachments(assessmentId, attachment, type, obj)
      .subscribe(() => {
        this.alertService.success(this.alertMessage);
      });
  }

  private async setExistingAttachments(): Promise<void> {
    const image = this.question.attachments.find(
      (i) => i.attachment_type === 'IMAGE'
    );
    const audio = this.question.attachments.find(
      (a) => a.attachment_type === 'AUDIO'
    );

    if (this.toClone) {
      if (image) {
        await this.objectToFile(image);
      }
      if (audio) {
        await this.objectToFile(audio);
      }
    } else {
      if (image) {
        this.imageAttachment = image;
        this.imageAttachment.name = image ? image.file.split('/').at(-1) : null;
      }
      if (audio) {
        this.audioAttachment = audio;
        this.audioAttachment.name = audio ? audio.file.split('/').at(-1) : null;
      }
    }
  }

  private resetForm(): void {
    this.attachmentsResetSubject$.next();
    this.inputForm.controls['order'.toString()].setValue(this.order + 1);
    this.inputForm.controls.question_type.setValue('INPUT');

    this.imageAttachment = null;
    this.audioAttachment = null;

    this.changedAudio = false;
    this.changedImage = false;
  }

  private async objectToFile(attachment): Promise<void> {
    const fileType = attachment.attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';
    const fileName = attachment.file.split('/').at(-1);

    await fetch(attachment.file)
      .then((res) => res.arrayBuffer())
      .then((buf) =>  new File([buf], fileName, {type: fileType}))
      .then((file) => {
        if (attachment.attachment_type === 'IMAGE') {
          this.imageAttachment = file;
        }
        else if (attachment.attachment_type === 'AUDIO') {
          this.audioAttachment = file;
        }
    });
  }

  public onSave(): void {
    if (this.question && !this.toClone) {
      this.alertMessage = 'Question successfully updated';
      this.editQuestion();
    } else if (this.toClone) {
      this.alertMessage = 'Question successfully cloned';
      this.createInputQuestion();
    } else {
      this.alertMessage = 'Question successfully created';
      this.createInputQuestion();
    }
  }

  public onNewImageAttachment(event: File): void {
    this.changedImage = true;
    this.imageAttachment = event;
  }

  public onNewAudioAttachment(event: File): void {
    this.changedAudio = true;
    this.audioAttachment = event;
  }
}
