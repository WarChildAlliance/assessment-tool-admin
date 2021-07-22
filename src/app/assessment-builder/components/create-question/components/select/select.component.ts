import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topicId: number;

  public options: FormArray = new FormArray([]) as FormArray;

  public selectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    multiple: new FormControl('', [Validators.required]),
    options: new FormArray([]),
  });

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
  }


  addOption(): void {
    this.options.push(new FormControl(''));
  }


  createSelect(): void {
    const newQuestion = {
      question_type: 'SELECT',
      title: this.selectForm.value.title,
      order: this.selectForm.value.order,
      multiple: this.selectForm.value.multiple,
      options: [{value: '3', valid: true}]
    };

    this.assessmentService.createQuestion(newQuestion, this.topicId.toString(), this.assessmentId.toString()).subscribe((res) => {
      console.log('res', res);
    });
  }

}
