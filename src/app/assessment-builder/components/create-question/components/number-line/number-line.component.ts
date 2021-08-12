import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-number-line',
  templateUrl: './number-line.component.html',
  styleUrls: ['./number-line.component.scss']
})
export class NumberLineComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topicId: number;
  @Input() question = null;
  @Input() questionsCount = 0;

  public imageAttachment = null;
  public audioAttachment = null;
  public icon = null;

  public iconType = '';

  public fileName: string;


  public numberLineForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    endNumber: new FormControl('', [Validators.required]),
    stepSize: new FormControl('', [Validators.required]),
    solution: new FormControl('', [Validators.required]),
    showTicks: new FormControl(false ),
    showValue: new FormControl(false),
  });

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    if (this.question){
      const q = this.question;
      this.numberLineForm.setValue({title: q.title, order: 1, startNumber: q.start, endNumber: q.end,
        stepSize: q.step, solution: q.expected_value, showTicks: q.show_ticks, showValue: q.show_value});
    } else {
      this.numberLineForm.patchValue({
        order: this.questionsCount + 1
      });
    }
  }

  createNumberLine(): void{
    const values = this.numberLineForm.value;
    const newQuestion = {
      question_type: 'NUMBER_LINE',
      title: values.title,
      order: values.order,
      start: values.startNumber,
      end: values.endNumber,
      step: values.stepSize,
      expected_value: values.solution,
      show_ticks: values.showTicks,
      show_value: values.showValue,
    };


    if (this.question) {
      this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
      this.question.id,  newQuestion).subscribe(res => {
        // TODO very ugly solution. can be simplified similar to the select options
        if (this.imageAttachment ) {
          if (res.attachments.length === 0 ) {
            this.assessmentService.addAttachments(this.assessmentId.toString(), this.imageAttachment,
            'IMAGE', {name: 'question', value: res.id}).subscribe( attachment => {
              // TODO need snackbar here?
            });
          } else {
            this.assessmentService.updateAttachments(this.assessmentId.toString(), this.imageAttachment,
            'IMAGE', res.attachments[0].id).subscribe( attachment => {
            });
          }
        }
        if (this.audioAttachment ) {
          if (res.attachments.length === 0 ) {
            this.assessmentService.addAttachments(this.assessmentId.toString(), this.audioAttachment,
            'AUDIO', {name: 'question', value: res.id}).subscribe( attachment => {
              // TODO need snackbar here?
            });
          } else {
            this.assessmentService.updateAttachments(this.assessmentId.toString(), this.audioAttachment,
            'AUDIO', res.attachments[0].id).subscribe( attachment => {
            });
          }
        }
        });
    } else {
      this.assessmentService.createQuestion(newQuestion, this.topicId.toString(),
      this.assessmentId.toString()).subscribe((res) => {
        if (this.imageAttachment) {
          this.assessmentService.addAttachments(this.assessmentId.toString(), this.imageAttachment,
          'IMAGE', {name: 'question', value: res.id}).subscribe( attachment => {
            // TODO need snackbar here?
          });
        }
        if (this.audioAttachment) {
          this.assessmentService.addAttachments(this.assessmentId.toString(), this.audioAttachment,
          'AUDIO', {name: 'question', value: res.id}).subscribe( attachment => {
            // TODO need snackbar here?
          });
        }
      });
    }
  }

  handleFileInput(event, type): void {
    if (type === 'IMAGE'){
      this.imageAttachment = event.target.files[0];
    } else if (type === 'AUDIO') {
      this.audioAttachment = event.target.files[0];
    }
  }


}
