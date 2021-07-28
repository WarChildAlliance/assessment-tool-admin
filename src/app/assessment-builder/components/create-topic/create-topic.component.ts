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

  public attachment = null;
  public icon = null;


  public AttachmentForm: FormGroup = new FormGroup({
    iconType : new FormControl(''),
    attachmentType : new FormControl(''),
  });

  public TopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    icon: new FormControl('', [Validators.required]),
    attachment: new FormControl('', [Validators.required]),
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
      console.log(t);
      this.TopicForm.setValue({name: t.name, icon: '', attachment: '', order: 1, description: t.description, showFeedback: t.show_feedback,
        allowSkip: t.allow_skip, evaluated: t.evaluated, praise: t.praise, maxWrongAnswers: t.max_wrong_answers});
    }
  }

  createTopic(): void {
    const formvalues = this.TopicForm.value;
    if (this.topic) {
      this.assessmentService.editTopic(this.assessmentId.toString(), this.topic.id, formvalues).subscribe(res => {
        if (this.attachment) {
          this.assessmentService.updateAttachments(this.assessmentId.toString(), this.attachment,
          this.AttachmentForm.value.attachmentType, res.attachments[0].id).subscribe( attachment => {
          });
        }
      });
    } else {
      this.assessmentService.createTopic(this.TopicForm.value, this.assessmentId.toString()).subscribe(res => {
        if (this.attachment) {
          this.assessmentService.addAttachments(this.assessmentId.toString(), this.attachment,
          this.AttachmentForm.value.attachmentType, {name: 'topic', value: res.id}).subscribe( attachment => {
            // TODO need snackbar here?
          });
        }
      });
    }
  }

  handleFileInput(event, type): void {
    if (type === 'attachment'){
      this.attachment = event.target.files[0];
    } else {
      this.icon = event.target.files[0];
    }
  }

}
