import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-topic-form-dialog',
  templateUrl: './topic-form-dialog.component.html',
  styleUrls: ['./topic-form-dialog.component.scss']
})
export class TopicFormDialogComponent implements OnInit {

  @Input() assessmentId;
  @Input() topic;
  @Input() edit: boolean;

  public imageAttachment = null;
  public audioAttachment = null;
  public icon = null;

  public feedbacks = [{id: 0, name: 'Never'}, {id: 1, name: 'Always'}, {id: 2, name: 'Second attempt'}];

  public createNewTopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    show_feedback: new FormControl(0, [Validators.required]),
    allow_skip: new FormControl(false, [Validators.required]),
    evaluated: new FormControl(true, [Validators.required]),
    praise: new FormControl(0, [Validators.required]),
    max_wrong_answers: new FormControl(0, [Validators.required])
  });

  constructor(private assessmentService: AssessmentService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    if (this.topic) {
      this.createNewTopicForm.setValue({
        name: this.topic.name,
        description: this.topic.description,
        show_feedback: this.topic.show_feedback,
        allow_skip: this.topic.allow_skip,
        evaluated: this.topic.evaluated,
        praise: this.topic.praise,
        max_wrong_answers: this.topic.max_wrong_answers,
      });
    }
  }

  onSave(): void {
    if (this.edit) {
      this.assessmentService.editTopic(this.assessmentId.toString(), this.topic.id, this.createNewTopicForm.value).subscribe(res => {
        if (this.icon) {
          this.saveAttachments(this.assessmentId, this.icon, 'IMAGE', {name: 'topic', value: res.id});
        } else {
          this.alertService.success('Topic was altered successfully');
        }
      });
    } else {
      this.assessmentService.createTopic(this.assessmentId.toString(), this.createNewTopicForm.value).subscribe(res => {
        if (this.icon) {
          this.saveAttachments(this.assessmentId, this.icon, 'IMAGE', {name: 'topic', value: res.id});
        } else {
          this.alertService.success('Topic was created successfully');
        }
      });
    }
  }

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success('Topic was saved successfully');
    });
  }

  handleFileInput(event, type): void {

    if (type === 'IMAGE') {
      this.imageAttachment = event.target.files[0];
    } else if  (type === 'AUDIO') {
      this.audioAttachment = event.target.files[0];
    } else {
      this.icon = event.target.files[0];
      this.createNewTopicForm.patchValue({
        icon: this.icon
      });

    }
  }

}
