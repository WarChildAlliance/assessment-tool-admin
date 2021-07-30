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

  public attachment = null;
  public icon = null;

  public attachmentType = '';
  public iconType = '';

  public fileName: string;


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
      this.inputForm.setValue({title: q.title, order: 1, answer: q.valid_answer, imageAttachment: null, audioAttachment: null});
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

  handleFileInput(event, type): void {
    if (type === 'attachment'){
      this.attachment = event.target.files[0];
    } else {
      this.icon = event.target.files[0];
    }
    this.fileName = event.target.files[0].name;
  }

  setType(item, type): void {
    if (item === 'attachment') {
      this.attachmentType = type;
    } else {
      this.iconType = type;
    }
  }
}
