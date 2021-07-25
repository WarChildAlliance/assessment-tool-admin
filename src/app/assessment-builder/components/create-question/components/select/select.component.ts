import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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

  public amountOptions = [0, 1];
  public options = [];

  public selectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    multiple: new FormControl('', [Validators.required])
  });

  constructor(
    private assessmentService: AssessmentService,
    private alertService: AlertService
    ) { }

  ngOnInit(): void {
    if (this.question) {
      const q = this.question;
      this.selectForm.setValue({title: q.title, order: 1, multiple: q.multiple});
      this.options = q.options;
    }
  }

  createOption(): void {
    this.amountOptions.push(this.addOption.length);
    if (this.question) {
      this.options.push({valid: false, value: ''});
    }
  }

  addOption(event, index): void {
    // TODO should be temporary until attachments are resolved
    const option = {value: event.value.value, valid: event.value.valid ? true : false};
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
        multiple: this.selectForm.value.multiple ? true : false,
        options: this.options
      };

      if (this.question) {
        this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
        this.question.id,  newQuestion).subscribe(res => console.log('todo make snackbar', res) );
      } else {
        this.assessmentService.createQuestion(newQuestion, this.topicId.toString(),
        this.assessmentId.toString()).subscribe((res) => {
          console.log('res', res);
        });
      }
    }
  }


}
