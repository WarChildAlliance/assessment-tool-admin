import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topicId: number;
  @Input() question = null;
  @Input() questionsCount = 0;

  public amountOptions = [0, 1];
  public options = [];

  public selectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    display: new FormControl('GRID', [Validators.required]),
    multiple: new FormControl(false)
  });

  constructor(
    private assessmentService: AssessmentService,
    private alertService: AlertService
    ) { }

  ngOnInit(): void {
    if (this.question) {
      const q = this.question;
      this.selectForm.setValue({title: q.title, order: 1, display: q.display_type ? q.display_type : 'GRID', multiple: q.multiple});
      this.options = q.options;
    } else {
      this.selectForm.patchValue({
        order: this.questionsCount + 1
      });
    }
  }

  createOption(): void {
    this.amountOptions.push(this.addOption.length);
    if (this.question) {
      this.options.push({valid: false, value: ''});
    }
  }

  addOption(event, index): void {
    const optionValue = event.option.value;
    // TODO should be temporary until attachments are resolved
    const option = {option: {value: optionValue.value, valid: optionValue.valid ? true : false},
    image: event.image, audio: event.audio};
    if (this.options.length < index) {
      this.options.push(option);
    } else {
      this.options[index] = option;
    }
  }


  createSelect(): void {

    if (this.options.length < 2) {
      this.alertService.error('You need at least 2 options for a select question');
    } else {
      const newQuestion = {
        question_type: 'SELECT',
        title: this.selectForm.value.title,
        order: this.selectForm.value.order,
        display_type: this.selectForm.value.display,
        multiple: this.selectForm.value.multiple ? true : false,
        options: this.options.map( o => o.option)
      };
      const hasAttachment = this.options.find( o => {
        return o.audioAttachment !== null || o.imageAttachment !== null;
      });


      if (this.question) {
        this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
        this.question.id,  newQuestion).subscribe(res => {
          if (hasAttachment) {
            this.options.forEach( (o, index) => {
              if (o.image) {
                this.assessmentService.addAttachments(this.assessmentId.toString(), o.imageAttachment,
                  'IMAGE', {name: 'select_option', value: res.select_options[index].id}).subscribe();
              }
              if (o.audio) {
                this.assessmentService.addAttachments(this.assessmentId.toString(), o.audio,
                  'AUDIO', {name: 'select_option', value: res.select_options[index].id}).subscribe();
              }
            });
          }
          console.log('todo make snackbar', res); });
      } else {
        this.assessmentService.createQuestion(newQuestion, this.topicId.toString(),
        this.assessmentId.toString()).subscribe((res) => {
          if (hasAttachment) {
            this.options.forEach( (o, index) => {
              if (o.image) {
                this.assessmentService.addAttachments(this.assessmentId.toString(), o.image,
                  'IMAGE', {name: 'select_option', value: res.options[index].id}).subscribe();
              }
              if (o.audio) {
                this.assessmentService.addAttachments(this.assessmentId.toString(), o.audio,
                  'AUDIO', {name: 'select_option', value: res.options[index].id}).subscribe();
              }
            });
          }
          console.log('res', res);
        });
      }
    }
  }


}
