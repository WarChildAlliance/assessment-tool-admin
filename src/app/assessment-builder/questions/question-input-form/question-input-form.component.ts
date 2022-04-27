import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-input-form',
  templateUrl: './question-input-form.component.html',
  styleUrls: ['./question-input-form.component.scss'],
})
export class QuestionInputFormComponent implements OnInit {
  @Input() assessmentId;
  @Input() topicId;
  @Input() order;
  @Input() question;
  @Input() toClone;

  @Output() questionCreatedEvent = new EventEmitter<boolean>();

  public imageAttachment = null;
  public audioAttachment = null;
  // making sure that we dont store an new attachment on editQuestion, if attachment didnt change
  public changedAudio = false;
  public changedImage = false;

  public alertMessage = '';

  public inputForm: FormGroup = new FormGroup({
    question_type: new FormControl('INPUT'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    valid_answer: new FormControl('', [Validators.required]),
  });

  constructor(
    private assessmentService: AssessmentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (this.question) {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: this.question.title,
        order: this.question.order,
        valid_answer: this.question.valid_answer,
      });

      this.setExistingAttachments();
    } else {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: '',
        order: this.order,
        valid_answer: '',
      });
    }
  }

  onSave(): void {
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

  createInputQuestion(): void {
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
      });
  }

  editQuestion(): void {
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
      });
  }

  updateQuestionAttachments(type: string, id: any, attachment: any): void {
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

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService
      .addAttachments(assessmentId, attachment, type, obj)
      .subscribe(() => {
        this.alertService.success(this.alertMessage);
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

  setExistingAttachments(): void {
    const image = this.question.attachments.find(
      (i) => i.attachment_type === 'IMAGE'
    );
    const audio = this.question.attachments.find(
      (a) => a.attachment_type === 'AUDIO'
    );

    if (image) {
      this.imageAttachment = image;
      this.imageAttachment.name = image ? image.file.split('/').at(-1) : null;
    }

    if (audio) {
      this.audioAttachment = audio;
      this.audioAttachment.name = audio ? audio.file.split('/').at(-1) : null;
    }
  }

  addRecordedAudio(event): void {
    const name = 'recording_' + new Date().toISOString() + '.wav';
    this.audioAttachment = this.blobToFile(event, name);
    this.changedAudio = true;
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
  }
}
