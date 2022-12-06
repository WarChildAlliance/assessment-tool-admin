import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LearningObjective } from 'src/app/core/models/learning-objective.model';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { LanguageService } from 'src/app/core/services/language.service';

interface DialogData {
  edit?: boolean;
  topic?: any;
  assessmentId?: any;
  order?: string;
  subject?: string;
  grade?: '1' | '2' | '3';
  subtopicId?: number | null;
}

@Component({
  selector: 'app-topic-form-dialog',
  templateUrl: './topic-form-dialog.component.html',
  styleUrls: ['./topic-form-dialog.component.scss']
})
export class TopicFormDialogComponent implements OnInit {

  public topicsList: any;
  public selectTopic: boolean;
  public learningObjectives: LearningObjective[];

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

  public selectTopicForm: FormGroup = new FormGroup({
    topic: new FormControl(null)
  });

  public createNewTopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    learning_objective: new FormControl(''),
    show_feedback: new FormControl(0, [Validators.required]),
    allow_skip: new FormControl(false, [Validators.required]),
    evaluated: new FormControl(true, [Validators.required]),
    praise: new FormControl(0, [Validators.required]),
    max_wrong_answers: new FormControl(0, [Validators.required]),
    order: new FormControl(0, [Validators.required]),
    icon: new FormControl(null),
    archived: new FormControl(false)
  });

  private toClone: boolean;
  private subject: string;
  private grade: string;
  private subtopicId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public languageService: LanguageService,
    private assessmentService: AssessmentService,
    private alertService: AlertService,
    private utilitiesService: UtilitiesService
    ) {}

  ngOnInit(): void {
    if (this.data?.assessmentId) { this.assessmentId = this.data?.assessmentId; }
    if (this.data?.topic) { this.topic = this.data?.topic; }
    if (this.data?.edit) { this.edit = this.data?.edit; }
    if (this.data?.order) { this.order = this.data?.order; }
    if (this.data?.subject) { this.subject = this.data?.subject; }
    if (this.data?.grade) { this.grade = this.data.grade; }
    if (this.data?.subtopicId) {
      this.subtopicId = this.data.subtopicId;
      this.getLearningObjectives();
    }
    if (this.topic) {
      this.setForm(this.topic);
    } else {
      this.getTopics();
      this.selectTopic = true;
      this.createNewTopicForm.controls.order.setValue(this.order);
    }
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

  public onSelectTopic(): void {
    this.toClone = true;
    const topicId = this.selectTopicForm.controls.topic.value.id;
    const assessmentId = this.selectTopicForm.controls.topic.value.assessment_id;

    this.assessmentService.getTopicDetails(assessmentId, topicId).subscribe(details => {
      this.setForm(details);
    });
  }

  private getTopics(): void {
    this.assessmentService.getAssessmentTopicsList().subscribe(topics => {
      this.topicsList = topics;
    });
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
    this.formData.append('learning_objective', this.createNewTopicForm.value.learning_objective);
    this.formData.append('show_feedback', this.createNewTopicForm.value.show_feedback);
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
      learning_objective: topic.learning_objective?.code ?? '',
      show_feedback: topic.show_feedback,
      allow_skip: topic.allow_skip,
      evaluated: topic.evaluated,
      praise: topic.praise,
      max_wrong_answers: topic.max_wrong_answers,
      order: this.toClone ? this.order : topic.order,
      icon: this.icon,
      archived: topic.archived
    });
    // this.getLearningObjectives();
  }

  // When creating a new topic based on an existing one: convert object from icon to file
  private async iconToFile(icon): Promise<void> {
    const fileName = icon.split('/').at(-1);

    await fetch(this.utilitiesService.getSource(icon))
      .then((res) => res.arrayBuffer())
      .then((buf) =>  new File([buf], fileName, {type: 'IMAGE'}))
      .then((file) => {
        this.icon = file;
      }
    );
  }

  private getLearningObjectives(): void {
    const filteringParams = {
      grade: this.grade,
      subject: this.subject,
      subtopic: this.subtopicId,
    };
    this.assessmentService.getLearningObjectives(filteringParams).subscribe((objectives: LearningObjective[]) => {
      this.learningObjectives = objectives;

      if (this.learningObjectives?.length) {
        this.createNewTopicForm.controls.learning_objective.setValidators([Validators.required]);
      } else {
        this.createNewTopicForm.controls.learning_objective.clearValidators();
      }
      this.createNewTopicForm.controls.learning_objective.updateValueAndValidity();

      const currentObjective = this.createNewTopicForm.controls.learning_objective.value;
      if (currentObjective && !this.learningObjectives.find(el => el.code === currentObjective)) {
        this.createNewTopicForm.controls.learning_objective.setValue('');
      }
    });
  }
}
