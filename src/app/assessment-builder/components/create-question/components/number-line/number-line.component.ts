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

  public numberLineForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    endNumber: new FormControl('', [Validators.required]),
    stepSize: new FormControl('', [Validators.required]),
    solution: new FormControl('', [Validators.required]),
    showTicks: new FormControl('', [Validators.required]),
    showValue: new FormControl('', [Validators.required]),
  });

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
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

    this.assessmentService.createQuestion(newQuestion, this.topicId.toString(), this.assessmentId.toString()).subscribe((res) => {
      console.log('res', res);
    });
  }

}
