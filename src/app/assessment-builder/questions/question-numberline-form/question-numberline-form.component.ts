import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
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
      });
  }

  editQuestion(): void {
    this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
      this.question.id, this.numberLineForm.value).subscribe(res => {
        if (this.imageAttachment && this.changedImage) {
          const image = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
          this.assessmentService.updateAttachments(this.assessmentId, this.imageAttachment, 'IMAGE', image.id).subscribe();
        }
        if (this.audioAttachment && this.changedAudio) {
          const audio = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
          this.assessmentService.updateAttachments(this.assessmentId, this.audioAttachment, 'AUDIO', audio.id).subscribe();
        }
        this.alertService.success(this.alertMessage);
        this.questionCreatedEvent.emit(true);
        this.closeModalEvent.emit(true);
      });
  }

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success(this.alertMessage);
    });
  }

  handleFileInput(event, type): void {
    if (type === 'IMAGE'){
      if (this.imageAttachment) { this.changedImage = true; }
      this.imageAttachment = event.target.files[0];
    } else if (type === 'AUDIO') {
      if (this.audioAttachment) { this.changedAudio = true; }
      this.audioAttachment = event.target.files[0];
    }
  }

  setExistingAttachments(): void{
    const image = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    const audio = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
    this.imageAttachment = image;
    this.audioAttachment = audio;
    this.imageAttachment.name = image ? image.file.split('/').at(-1) : null;
    this.audioAttachment.name = audio ? audio.file.split('/').at(-1) : null;
  }

  addRecordedAudio(event): void {
    const name = 'recording_' + new Date().toISOString() + '.wav';
    this.audioAttachment = this.blobToFile(event, name);
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
  }

}
