import { Component, Input, OnInit } from '@angular/core';
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

  private imageAttachment = null;
  private audioAttachment = null;

  public alertMessage =  '';


  public numberLineForm: FormGroup = new FormGroup({
    question_type: new FormControl('NUMBER_LINE'),
    title: new FormControl('', [Validators.required]),
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
        } else if (this.audioAttachment) {
          this.saveAttachments(this.assessmentId, this.audioAttachment, 'AUDIO', { name: 'question', value: res.id });
        } else {
          this.alertService.success(this.alertMessage);
        }
      });
  }

  editQuestion(): void {
    this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
      this.question.id, this.numberLineForm.value).subscribe(res => {
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
    if (type === 'IMAGE'){
      this.imageAttachment = event.target.files[0];
    } else if (type === 'AUDIO') {
      this.audioAttachment = event.target.files[0];
    }
  }

}
