import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  private imageAttachment = null;
  private audioAttachment = null;
  public alertMessage =  '';

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
}
