import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topic = null;

  public TopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    showFeedback: new FormControl(0, [Validators.required]),
    allowSkip: new FormControl(false, [Validators.required]),
    evaluated: new FormControl(false, [Validators.required]),
    praise: new FormControl(0, [Validators.required]),
    maxWrongAnswers: new FormControl(0, [Validators.required])
  });

  public feedback = [{id: 0, name: 'never'}, {id: 1, name: 'always'}, {id: 2, name: 'second attempt'}];

  constructor(
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    if (this.topic) {
      const t = this.topic;
      this.TopicForm.setValue({name: t.name, order: 1, description: t.description, showFeedback: t.show_feedback,
        allowSkip: t.allow_skip, evaluated: t.evaluated, praise: t.praise, maxWrongAnswers: t.max_wrong_answers});
    }
  }

  createTopic(): void {
    const formvalues = this.TopicForm.value;
    if (this.topic) {
      this.assessmentService.editTopic(this.assessmentId.toString(), this.topic.id, formvalues).subscribe(res => console.log('todo make snackbar', res) );
    } else {
      this.assessmentService.createTopic(this.TopicForm.value, this.assessmentId.toString()).subscribe(res => console.log('todo make snackbar', res) );
    }
  }

}
