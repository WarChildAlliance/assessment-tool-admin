import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-input-form',
  templateUrl: './question-input-form.component.html',
  styleUrls: ['./question-input-form.component.scss']
})
export class QuestionInputFormComponent implements OnInit {

  @Input() assessmentId;
  @Input() topicId;
  @Input() order;
  @Input() question;
  @Input() toClone;

  @Output() questionCreatedEvent = new EventEmitter<boolean>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  @ViewChild('formDirective') private formDirective: NgForm;

  private imageAttachment = null;
  private audioAttachment = null;
  // making sure that we dont store an new attachment on editQuestion, if attachment didnt change
  public changedAudio = false;
  public changedImage = false;

  public alertMessage =  '';
  public resetQuestionAudio = false;

  public inputForm: FormGroup = new FormGroup({
    question_type: new FormControl('INPUT'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    valid_answer: new FormControl('', [Validators.required])
  });

  constructor(private assessmentService: AssessmentService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    if (this.question) {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: this.question.title,
        order: this.question.order,
        valid_answer: this.question.valid_answer
      });
    } else {
      this.inputForm.setValue({
        question_type: 'INPUT',
        title: '',
        order: this.order,
        valid_answer: ''
      });
    }
  }

  onSave(): void {
    if (this.question && !this.toClone) {
      this.alertMessage = 'Question successfully updated';
      this.editQuestion();
    } else if (this.toClone){
      this.alertMessage = 'Question successfully cloned';
      this.createInputQuestion();
    } else {
      this.alertMessage = 'Question successfully created';
      this.createInputQuestion();
    }
  }
  createInputQuestion(): void {
    this.assessmentService.createQuestion(this.inputForm.value, this.topicId.toString(),
      this.assessmentId.toString()).subscribe((res) => {

        if (this.imageAttachment) {
          this.saveAttachments(this.assessmentId, this.imageAttachment, 'IMAGE', { name: 'question', value: res.id });
        } else if (this.audioAttachment) {
          this.saveAttachments(this.assessmentId, this.audioAttachment, 'AUDIO', { name: 'question', value: res.id });
        } else {
          this.alertService.success(this.alertMessage);
          this.questionCreatedEvent.emit(true);
          if (!this.toClone) {
            this.resetForm();
          }
        }
      });
  }

  editQuestion(): void {
    this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
      this.question.id, this.inputForm.value).subscribe(res => {
        if (this.imageAttachment) {
          this.saveAttachments(this.assessmentId, this.imageAttachment, 'IMAGE', { name: 'question', value: res.id });
        } else if (this.audioAttachment) {
          this.saveAttachments(this.assessmentId, this.audioAttachment, 'AUDIO', { name: 'question', value: res.id });
        } else {
          this.alertService.success(this.alertMessage);
          this.questionCreatedEvent.emit(true);
          this.closeModalEvent.emit(true);
        }
      });
  }

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success(this.alertMessage);
    });
  }

  handleFileInput(event, type): void {
    if (type === 'IMAGE') {
      this.imageAttachment = event.target.files[0];
    } else if (type === 'AUDIO') {
      this.audioAttachment = event.target.files[0];
    }
  }

  resetForm(): void {
    this.formDirective.resetForm();
    this.inputForm.controls['order'.toString()].setValue(this.order + 1);

    this.imageAttachment = null;
    this.audioAttachment = null;

    this.changedAudio = false;
    this.changedImage = false;

    this.resetQuestionAudio = true;
  }
}
