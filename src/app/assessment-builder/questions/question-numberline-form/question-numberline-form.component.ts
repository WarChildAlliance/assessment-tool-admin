import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

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
  public questionsList: any;
  public selectQuestion: boolean;

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

  public alertMessage =  '';
  public attachmentsResetSubject$ = new Subject<void>();

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

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
    private translateService: TranslateService,
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
      this.setForm(this.question);
    } else {
      this.getQuestionsList();
      this.selectQuestion = true;
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

  private createNumberLineQuestion(): void {
    this.assessmentService.createQuestion(this.numberLineForm.value, this.topicId.toString(),
      this.assessmentId.toString()).subscribe((res) => {
        if (this.imageAttachment) {
          this.saveAttachments(this.assessmentId, this.imageAttachment, 'IMAGE', { name: 'question', value: res.id });
        }
        if (this.audioAttachment) {
          this.saveAttachments(this.assessmentId, this.audioAttachment, 'AUDIO', { name: 'question', value: res.id });
        }
        this.alertService.success(this.alertMessage);
        this.questionCreatedEvent.emit(true);
        if (!this.toClone) {
          this.resetForm();
        }
      });
  }

  private editQuestion(): void {
    this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
      this.question.id, this.numberLineForm.value).subscribe(res => {
        if (this.imageAttachment && this.changedImage) {
          this.updateQuestionAttachments('IMAGE', res.id, this.imageAttachment);
        }
        if (this.audioAttachment && this.changedAudio) {
          this.updateQuestionAttachments('AUDIO', res.id, this.audioAttachment);
        }
        this.alertService.success(this.alertMessage);
        this.questionCreatedEvent.emit(true);
        this.closeModalEvent.emit(true);
      });
  }

  private updateQuestionAttachments(type: string, id: any, attachment: any): void {
    const file = this.question.attachments.find( a => a.attachment_type === type);
    if (file) {
      this.assessmentService.updateAttachments(this.assessmentId, attachment, type, file.id).subscribe();
    } else {
      this.saveAttachments(this.assessmentId, attachment, type, { name: 'question', value: id });
    }
  }

  private saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success(this.alertMessage);
    });
  }

  private async setExistingAttachments(): Promise<void>{
    const image = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    const audio = this.question.attachments.find( a => a.attachment_type === 'AUDIO');

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
    this.numberLineForm.controls['order'.toString()].setValue(this.order + 1);
    this.numberLineForm.controls.question_type.setValue('NUMBER_LINE');
    this.numberLineForm.controls.show_ticks.setValue(false);
    this.numberLineForm.controls.show_value.setValue(false);

    this.imageAttachment = null;
    this.audioAttachment = null;

    this.changedAudio = false;
    this.changedImage = false;

    this.attachmentsResetSubject$.next();
  }

  private async objectToFile(attachment): Promise<void> {
    const fileType = attachment.attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';
    const fileName = attachment.file.split('/').at(-1);

    await fetch((attachment.file?.slice(0, 5) === 'http:') ? attachment.file : environment.API_URL + attachment.file)
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

  public onNewImageAttachment(event: File): void {
    this.changedImage = true;
    this.imageAttachment = event;
  }

  public onNewAudioAttachment(event: File): void {
    this.changedAudio = true;
    this.audioAttachment = event;
  }

  public onSubmit(): void {
    if (this.question && !this.toClone) {
      this.alertMessage = 'Question successfully updated';
      this.editQuestion();
    } else if (this.toClone){
      this.alertMessage = 'Question successfully cloned';
      this.createNumberLineQuestion();
    } else {
      this.alertMessage = 'Question successfully created';
      this.createNumberLineQuestion();
    }
  }

  // TODO: when merged 'GOBEE-260: Factorization of question forms' generalize this function and add to the question service
  public getQuestionsList(): void {
    this.assessmentService.getQuestionsTypeList('NUMBER_LINE').subscribe(questions => {
      this.questionsList = questions;
    });
  }

  public onSelectQuestion(): void {
    const question = this.selectQuestionForm.controls.question.value;
    this.toClone = true;
    this.setForm(question);
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
      tick_step: question.tick_step,
      expected_value: question.expected_value,
      show_ticks: question.show_ticks,
      show_value: question.show_value,
      on_popup: question.on_popup
    });

    await this.setExistingAttachments();

    if (this.toClone) {
      this.numberLineForm.markAsDirty();
    }
  }
}
