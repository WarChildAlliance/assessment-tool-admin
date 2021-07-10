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

  public TopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    showFeedback: new FormControl('', [Validators.required]),
    allowSkip: new FormControl('', [Validators.required]),
    evaluated: new FormControl('', [Validators.required]),
    praise: new FormControl('', [Validators.required]),
    maxWrongAnswers: new FormControl('', [Validators.required])
  });

  constructor(
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
  }

  createTopic(): void {
    const formvalues = this.TopicForm.value;
    const TopicToCreate: any = {
      name: formvalues.name,
      description: formvalues.description,
      assessment: this.assessmentId,
      showFeedback: formvalues.showFeedback,
      allowSkip: formvalues.allowSkip,
      evaluated: formvalues.evaluated,
      praise: formvalues.praise,
      maxWrongAnswers: formvalues.maxWrongAnswers,
    };
    this.assessmentService.createTopic(TopicToCreate, this.assessmentId.toString()).subscribe(res =>
      {
        // TODO put snackbar here
        console.log(res);
      });

  }

}
