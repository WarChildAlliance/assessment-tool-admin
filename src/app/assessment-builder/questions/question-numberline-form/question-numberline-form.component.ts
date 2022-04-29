import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-numberline-form',
  templateUrl: './question-numberline-form.component.html',
  styleUrls: ['./question-numberline-form.component.scss']
})
export class QuestionNumberlineFormComponent implements OnInit {

  @Input() assessmentId;
  @Input() topicId;
  @Input() order;
  @Input() question;
  @Input() toClone;

  @Output() questionCreatedEvent = new EventEmitter<boolean>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  public imageAttachment = null;
  public audioAttachment = null;
  // making sure that we dont store an new attachment on editQuestion, if attachment didnt change
  public changedAudio = false;
  public changedImage = false;

  public alertMessage =  '';
  public resetQuestionAudio = false;

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
  });

  constructor(private assessmentService: AssessmentService, private alertService: AlertService) { }

  ngOnInit(): void {
    if (this.question) {
      this.numberLineForm.setValue({
        question_type: 'NUMBER_LINE',
        title: this.question.title,
        order: this.question.order,
        start: this.question.start,
        end: this.question.end,
        step: this.question.step,
        tick_step: this.question.tick_step,
        expected_value: this.question.expected_value,
        show_ticks: this.question.show_ticks,
        show_value: this.question.show_value
      });

      this.setExistingAttachments();

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
        show_value: false
      });
    }
  }

  onSave(): void {
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

  createNumberLineQuestion(): void {
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

  editQuestion(): void {
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

  updateQuestionAttachments(type: string, id: any, attachment: any): void {
    const file = this.question.attachments.find( a => a.attachment_type === type);
    if (file) {
      this.assessmentService.updateAttachments(this.assessmentId, attachment, type, file.id).subscribe();
    } else {
      this.saveAttachments(this.assessmentId, attachment, type, { name: 'question', value: id });
    }
  }

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success(this.alertMessage);
    });
  }

  handleFileInput(event, type): void {
    if (type === 'IMAGE'){
      this.changedImage = true;
      this.imageAttachment = event.target.files[0];
    } else if (type === 'AUDIO') {
      this.changedAudio = true;
      this.audioAttachment = event.target.files[0];
    }
  }

  setExistingAttachments(): void{
    const image = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    const audio = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
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
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
  }

  resetForm(): void {
    this.numberLineForm.reset();
    this.numberLineForm.controls['order'.toString()].setValue(this.order + 1);
    this.numberLineForm.controls.question_type.setValue('NUMBER_LINE');
    this.numberLineForm.controls.show_ticks.setValue(false);
    this.numberLineForm.controls.show_value.setValue(false);

    this.imageAttachment = null;
    this.audioAttachment = null;

    this.changedAudio = false;
    this.changedImage = false;

    this.resetQuestionAudio = !this.resetQuestionAudio;
  }
}
