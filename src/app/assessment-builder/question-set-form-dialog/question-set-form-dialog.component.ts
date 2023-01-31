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
  questionSet?: any;
  assessmentId?: any;
  order?: string;
  subject?: string;
  grade?: '1' | '2' | '3';
  topicId?: number | null;
}

@Component({
  selector: 'app-question-set-form-dialog',
  templateUrl: './question-set-form-dialog.component.html',
  styleUrls: ['./question-set-form-dialog.component.scss']
})
export class QuestionSetFormDialogComponent implements OnInit {
  public questionSetsList: any;
  public selectQuestionSet: boolean;
  public learningObjectives: LearningObjective[];

  public assessmentId: string;
  public questionSet: any;
  public edit: boolean;
  public order: string;
  public formData: FormData = new FormData();

  public imageAttachment: File = null;
  public audioAttachment: File = null;
  public icon: File = null;

  public iconOptions = ['flower_green.svg', 'flower_purple.svg', 'flower_cyan.svg'];

  public selectQuestionSetForm: FormGroup = new FormGroup({
    questionSet: new FormControl(null)
  });

  public createNewQuestionSetForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    learning_objective: new FormControl(''),
    evaluated: new FormControl(true, [Validators.required]),
    order: new FormControl(0, [Validators.required]),
    icon: new FormControl(null)
  });

  private toClone: boolean;
  private subject: string;
  private grade: string;
  private topicId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public languageService: LanguageService,
    private assessmentService: AssessmentService,
    private alertService: AlertService,
    private utilitiesService: UtilitiesService
    ) {}

  ngOnInit(): void {
    if (this.data?.assessmentId) { this.assessmentId = this.data?.assessmentId; }
    if (this.data?.questionSet) { this.questionSet = this.data?.questionSet; }
    if (this.data?.edit) { this.edit = this.data?.edit; }
    if (this.data?.order) { this.order = this.data?.order; }
    if (this.data?.subject) { this.subject = this.data?.subject; }
    if (this.data?.grade) { this.grade = this.data.grade; }
    if (this.data?.topicId) {
      this.topicId = this.data.topicId;
      this.getLearningObjectives();
    }
    if (this.questionSet) {
      this.setForm(this.questionSet);
    } else {
      this.getQuestionSets();
      this.selectQuestionSet = true;
      this.createNewQuestionSetForm.controls.order.setValue(this.order);
    }
  }

  public saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe(() => {
      this.alertService.success('QuestionSet was saved successfully');
    });
  }

  public async onSubmit(): Promise<void> {
    const data = await this.formGroupToFormData();
    if (this.edit) {
      this.assessmentService.editQuestionSet(this.assessmentId.toString(), this.questionSet.id, data).subscribe(res => {
        this.alertService.success('QuestionSet was altered successfully');
      });
    } else {
      this.assessmentService.createQuestionSet(this.assessmentId.toString(), data).subscribe(res => {
        this.alertService.success('QuestionSet was created successfully');
      });
    }
  }

  public handleFileInput(event): void {
    this.icon = event;
    this.createNewQuestionSetForm.patchValue({icon: this.icon});
  }

  public onSelectQuestionSet(): void {
    this.toClone = true;
    const questionSetId = this.selectQuestionSetForm.controls.questionSet.value.id;
    const assessmentId = this.selectQuestionSetForm.controls.questionSet.value.assessment_id;

    this.assessmentService.getQuestionSetDetails(assessmentId, questionSetId).subscribe(details => {
      this.setForm(details);
    });
  }

  private getQuestionSets(): void {
    this.assessmentService.getAssessmentQuestionSetsList().subscribe(questionSets => {
      this.questionSetsList = questionSets;
    });
  }

  private async formGroupToFormData(): Promise<FormData> {
    // if user upload an icon
    if (this.icon) {
      this.formData.append('icon', this.icon);
    }
    // if user doesn’t upload an icon (on edit mode: set default icon if no icon has been uploaded before)
    else if (!this.questionSet?.icon) {
      await this.setDefaultIcon();
    }

    this.formData.append('name', this.createNewQuestionSetForm.value.name);
    this.formData.append('description', this.createNewQuestionSetForm.value.description);
    this.formData.append('learning_objective', this.createNewQuestionSetForm.value.learning_objective);
    this.formData.append('evaluated', this.createNewQuestionSetForm.value.evaluated);
    this.formData.append('order', this.createNewQuestionSetForm.value.order);

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

  private async setForm(questionSet: any): Promise<void> {
    this.selectQuestionSet = false;
    this.getLearningObjectives();

    if (this.toClone) {
      this.createNewQuestionSetForm.markAsDirty();
      if (questionSet.icon) {
        await this.iconToFile(questionSet.icon);
      }
    }
    this.createNewQuestionSetForm.setValue({
      name: questionSet.name,
      description: questionSet.description,
      learning_objective: questionSet.learning_objective?.code ?? '',
      evaluated: questionSet.evaluated,
      order: this.toClone ? this.order : questionSet.order,
      icon: this.icon
    });
  }

  // When creating a new question set based on an existing one: convert object from icon to file
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
      topic: this.topicId,
    };
    this.assessmentService.getLearningObjectives(filteringParams).subscribe((objectives: LearningObjective[]) => {
      this.learningObjectives = objectives;

      if (this.learningObjectives?.length) {
        this.createNewQuestionSetForm.controls.learning_objective.setValidators([Validators.required]);
      } else {
        this.createNewQuestionSetForm.controls.learning_objective.clearValidators();
      }
      this.createNewQuestionSetForm.controls.learning_objective.updateValueAndValidity();

      const currentObjective = this.createNewQuestionSetForm.controls.learning_objective.value;
      if (currentObjective && !this.learningObjectives.find(el => el.code === currentObjective)) {
        this.createNewQuestionSetForm.controls.learning_objective.setValue('');
      }
    });
  }
}
