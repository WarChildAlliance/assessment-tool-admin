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
  public formData: FormData = new FormData();

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
    max_wrong_answers: new FormControl(0, [Validators.required]),
    icon: new FormControl(null),
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
    const data = this.icon ? this.formGroupToFormData() : this.createNewTopicForm.value;
    if (this.edit) {
      this.assessmentService.editTopic(this.assessmentId.toString(), this.topic.id, data).subscribe(res => {
        this.alertService.success('Topic was altered successfully');
      });
    } else {
      this.assessmentService.createTopic(this.assessmentId.toString(), data).subscribe(res => {
        this.alertService.success('Topic was created successfully');
      });
    }
  }

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success('Topic was saved successfully');
    });
  }


  formGroupToFormData(): FormData {
    this.formData.append('icon', this.icon);
    this.formData.append('name', this.createNewTopicForm.value.name);
    this.formData.append('description', this.createNewTopicForm.value.description);
    this.formData.append('show_feedback', this.createNewTopicForm.value.show_feedback);
    this.formData.append('allow_skip', this.createNewTopicForm.value.allow_skip);
    this.formData.append('evaluated', this.createNewTopicForm.value.evaluated);
    this.formData.append('praise', this.createNewTopicForm.value.praise);
    this.formData.append('max_wrong_answers', this.createNewTopicForm.value.max_wrong_answers);

    return this.formData;
  }

  handleFileInput(event): void {
    this.icon = event.target.files[0];
    this.createNewTopicForm.patchValue({icon: this.icon});
  }

}

