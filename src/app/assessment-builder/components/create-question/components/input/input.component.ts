import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  constructor(private assessmentService: AssessmentService) { }

  public inputForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    answer: new FormControl('', [Validators.required]),
    imageAttachment: new FormControl('', [Validators.required]),
    audioAttachment: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
  }

  createInput(): void{
    const newQuestion = {
      question_type: 'INPUT',
      title: this.inputForm.value.title,
      order: this.inputForm.value.order,
      valid_answer: this.inputForm.value.answer
    };

    this.assessmentService.createQuestion(newQuestion, '17', '7').subscribe((res) => {
      console.log('res', res);
    });
  }
}
