import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topic = null;
  @Input() topicAmount = 0;

  public attachment = null;
  public icon = null;
  public attachmentType = null;
  public iconType = null;


  public TopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    order: new FormControl(0, [Validators.required]),
    icon: new FormControl(null, [Validators.required]),
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
    private assessmentService: AssessmentService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if (this.topic) {
      const t = this.topic;
      this.TopicForm.setValue({name: t.name, icon: '', attachment: '', order: t.order, description: t.description, showFeedback: t.show_feedback,
        allowSkip: t.allow_skip, evaluated: t.evaluated, praise: t.praise, maxWrongAnswers: t.max_wrong_answers});
    } else {
      this.TopicForm.patchValue({
        order: this.topicAmount + 1
      })
    }
  }

  createTopic(): void {
    const formvalues = this.TopicForm.value;

    const formData: FormData = new FormData();
    formData.append('name', formvalues.name);
    formData.append('order', formvalues.order);
    formData.append('description', formvalues.description);
    formData.append('showFeedback', formvalues.showFeedback);
    formData.append('allowSkip', formvalues.allowSkip);
    formData.append('evaluated', formvalues.evaluated);
    formData.append('praise', formvalues.praise);
    formData.append('maxWrongAnswers', formvalues.maxWrongAnswers);
    formData.append('icon', this.icon);

    if (this.topic) {
      this.assessmentService.editTopic(this.assessmentId.toString(), this.topic.id, formData).subscribe(res => {
        if (this.attachment) {
          if (res.attachments.length === 0) {
            this.assessmentService.addAttachments(this.assessmentId.toString(), this.attachment,
            this.attachmentType, {name: 'topic', value: res.id}).subscribe( attachment => {
              // TODO need snackbar here?
            });
          } else {
            this.assessmentService.updateAttachments(this.assessmentId.toString(), this.attachment,
            this.attachmentType, res.attachments[0].id).subscribe( attachment => {
            });
          }
        }
      });
    } else {
      this.assessmentService.createTopic(this.assessmentId.toString(), formData).subscribe(res => {
        if (this.attachment) {
          this.assessmentService.addAttachments(this.assessmentId.toString(), this.attachment,
          this.attachmentType, {name: 'topic', value: res.id}).subscribe( attachment => {
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

  setType(item, type): void {
    if (item === 'attachment') {
      this.attachmentType = type;
    } else {
      this.iconType = type;
    }
  }

}
