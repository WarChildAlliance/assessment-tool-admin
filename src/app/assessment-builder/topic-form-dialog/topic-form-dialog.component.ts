import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subtopic } from 'src/app/core/models/question.model';

interface DialogData {
  edit?: boolean;
  topic?: any;
  assessmentId?: any;
  order?: string;
  subject?: string;
}

@Component({
  selector: 'app-topic-form-dialog',
  templateUrl: './topic-form-dialog.component.html',
  styleUrls: ['./topic-form-dialog.component.scss']
})
export class TopicFormDialogComponent implements OnInit {
  private toClone: boolean;
  private subject: string;

  public topicsList: any;
  public selectTopic: boolean;

  public assessmentId: string;
  public topic: any;
  public edit: boolean;
  public order: string;
  public formData: FormData = new FormData();

  public imageAttachment: File = null;
  public audioAttachment: File = null;
  public icon: File = null;

  public iconOptions = ['flower_green.svg', 'flower_purple.svg', 'flower_cyan.svg'];

  public feedbacks = [{id: 0, name: 'Never'}, {id: 1, name: 'Always'}, {id: 2, name: 'Second attempt'}];
  public subtopics: Subtopic[];

  public selectTopicForm: FormGroup = new FormGroup({
    topic: new FormControl(null)
  });

  public createNewTopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    show_feedback: new FormControl(0, [Validators.required]),
    subtopic: new FormControl(''),
    allow_skip: new FormControl(false, [Validators.required]),
    evaluated: new FormControl(true, [Validators.required]),
    praise: new FormControl(0, [Validators.required]),
    max_wrong_answers: new FormControl(0, [Validators.required]),
    order: new FormControl(0, [Validators.required]),
    icon: new FormControl(null),
    archived: new FormControl(false)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translateService: TranslateService,
    private assessmentService: AssessmentService,
    private alertService: AlertService
    ) {}

  ngOnInit(): void {
    if (this.data?.assessmentId) { this.assessmentId = this.data?.assessmentId; }
    if (this.data?.topic) { this.topic = this.data?.topic; }
    if (this.data?.edit) { this.edit = this.data?.edit; }
    if (this.data?.order) { this.order = this.data?.order; }
    if (this.data?.subject) { this.subject = this.data?.subject; }
    if (this.topic) {
      this.setForm(this.topic);
    } else {
      this.getTopics();
      this.getSubtopics();
      this.selectTopic = true;
      this.createNewTopicForm.controls.order.setValue(this.order);
    }
  }

  private async formGroupToFormData(): Promise<FormData> {
    // if user upload an icon
    if (this.icon) {
      this.formData.append('icon', this.icon);
    }
    // if user doesn’t upload an icon (on edit mode: set default icon if no icon has been uploaded before)
    else if (!this.topic?.icon) {
      await this.setDefaultIcon();
    }

    this.formData.append('name', this.createNewTopicForm.value.name);
    this.formData.append('description', this.createNewTopicForm.value.description);
    this.formData.append('show_feedback', this.createNewTopicForm.value.show_feedback);
    this.formData.append('subtopic', this.createNewTopicForm.value.subtopic);
    this.formData.append('allow_skip', this.createNewTopicForm.value.allow_skip);
    this.formData.append('evaluated', this.createNewTopicForm.value.evaluated);
    this.formData.append('praise', this.createNewTopicForm.value.praise);
    this.formData.append('max_wrong_answers', this.createNewTopicForm.value.max_wrong_answers);
    this.formData.append('order', this.createNewTopicForm.value.order);
    this.formData.append('archived', this.createNewTopicForm.value.archived);

    return this.formData;
  }

  private async setDefaultIcon(): Promise<void> {
    const imageName = this.iconOptions[Math.floor(Math.random() * this.iconOptions.length)];
    const imagePath = '../../../../assets/icons/' + imageName;
    await fetch(imagePath)
      .then((res) => res.arrayBuffer())
      .then((buf) =>  new File([buf], imageName, {type: 'image/svg+xml'}))
      .then((file) => this.formData.append('icon', file));
  }

  public saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success('Topic was saved successfully');
    });
  }

  public async onSubmit(): Promise<void> {
    const data = await this.formGroupToFormData();
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

  public handleFileInput(event): void {
    this.icon = event;
    this.createNewTopicForm.patchValue({icon: this.icon});
  }

  private getTopics(): void {
    this.assessmentService.getAssessmentTopicsList().subscribe(topics => {
      this.topicsList = topics;
    });
  }

  private getSubtopics(): void {
    this.assessmentService.getSubtopics(this.subject).subscribe(subtopics => {
      this.subtopics = subtopics;

      if (this.subtopics?.length) {
        this.createNewTopicForm.controls.subtopic.setValidators([Validators.required]);
        this.createNewTopicForm.controls.subtopic.updateValueAndValidity();
      }
    });
  }

  public onSelectTopic(): void {
    this.toClone = true;
    const topicId = this.selectTopicForm.controls.topic.value.id;
    const assessmentId = this.selectTopicForm.controls.topic.value.assessment_id;

    this.assessmentService.getTopicDetails(assessmentId, topicId).subscribe(details => {
      this.setForm(details);
    });
  }

  private async setForm(topic: any): Promise<void> {
    this.selectTopic = false;

    if (this.toClone) {
      this.createNewTopicForm.markAsDirty();
      if (topic.icon) {
        await this.iconToFile(topic.icon);
      }
    }

    this.createNewTopicForm.setValue({
      name: topic.name,
      description: topic.description,
      show_feedback: topic.show_feedback,
      subtopic: topic.subtopic?.id,
      allow_skip: topic.allow_skip,
      evaluated: topic.evaluated,
      praise: topic.praise,
      max_wrong_answers: topic.max_wrong_answers,
      order: this.toClone ? this.order : topic.order,
      icon: this.icon,
      archived: topic.archived
    });
    if (this.topic.questions_count > 0) {
      this.createNewTopicForm.controls.subtopic.disable();
    }
    this.getSubtopics();
  }

  // When creating a new topic based on an existing one: convert object from icon to file
  private async iconToFile(icon): Promise<void> {
    const fileName = icon.split('/').at(-1);

    await fetch(icon)
      .then((res) => res.arrayBuffer())
      .then((buf) =>  new File([buf], fileName, {type: 'IMAGE'}))
      .then((file) => {
        this.icon = file;
      }
    );
  }
}
