import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topicId: number;
  @Input() question = null;
  @Input() questionsCount = 0;


  constructor(private assessmentService: AssessmentService) { }

  public inputForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    answer: new FormControl('', [Validators.required]),
    imageAttachment: new FormControl('', [Validators.required]),
    audioAttachment: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (this.question) {
      const q = this.question;
      this.inputForm.setValue({title: q.title, order: q.order, answer: q.valid_answer, imageAttachment: null, audioAttachment: null});
    } else {
      this.inputForm.patchValue({
        order: this.questionsCount + 1
      })
    }
  }

  createInput(): void{
    const newQuestion = {
      question_type: 'INPUT',
      title: this.inputForm.value.title,
      order: this.inputForm.value.order,
      valid_answer: this.inputForm.value.answer
    };

    if (this.question) {
      this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
      this.question.id,  newQuestion).subscribe(res => {
          console.log('todo make snackbar', res);
        });
    } else {
      this.assessmentService.createQuestion(newQuestion, this.topicId.toString(),
      this.assessmentId.toString()).subscribe((res) => {
        console.log('res', res);
      });
    }
  }
}
