import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { Language } from 'src/app/core/models/language.model';
import { Country } from 'src/app/core/models/country.model';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

interface DialogData {
  edit?: boolean;
  clone?: boolean;
  assessment?: any;
  assessmentsList?: any;
}
@Component({
  selector: 'app-assessment-form-dialog',
  templateUrl: './assessment-form-dialog.component.html',
  styleUrls: ['./assessment-form-dialog.component.scss']
})
export class AssessmentFormDialogComponent implements OnInit {
  public assessmentsList: any;
  public selectAssessment = true;

  public clone: boolean;
  public edit: boolean;
  public assessment: any;

  public icon: File = null;

  public grades = ['1', '2', '3'];
  public languages: Language[];
  public countries: Country[];
  public subjects = ['MATH', 'LITERACY'];
  public formData: FormData = new FormData();

  public iconOptions = ['flower_green.svg', 'flower_purple.svg', 'flower_cyan.svg'];

  public selectAssessmentForm: FormGroup = new FormGroup({
    assessment: new FormControl(null)
  });

  public assessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl(1, [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(false, [Validators.required]),
    icon: new FormControl(null),
    archived: new FormControl(false),
    downloadable: new FormControl(true),
    sel_question: new FormControl(true)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translateService: TranslateService,
    private assessmentService: AssessmentService,
    private userService: UserService,
    private alertService: AlertService,
    private utilitiesService: UtilitiesService
    ) {}

  ngOnInit(): void {
    if (this.data?.assessmentsList) { this.assessmentsList = this.data.assessmentsList; }
    if (this.data?.assessment) { this.assessment = this.data.assessment; }
    if (this.data?.edit) { this.edit = this.data.edit; }
    if (this.data?.clone) { this.clone = this.data.clone; }
    this.userService.getLanguages().subscribe((res: Language[]) => this.languages = res);
    this.userService.getCountries().subscribe((res: Country[]) => this.countries = res);
    if (this.edit || this.clone) {
      this.setForm(this.assessment);
    }
  }

  public async saveAssessment(): Promise<void> {
    const data = await this.formGroupToFormData();
    if (this.edit) {
      this.assessmentService.editAssessment(this.assessment.id, data).subscribe(() => {
        this.alertService.success(this.translateService.instant('general.editSuccess', {
          type: this.translateService.instant('general.assessment')
        }));
      });
    } else {
      this.assessmentService.createAssessment(data).subscribe(res => {
        this.alertService.success(this.translateService.instant('assessmentBuilder.saveSuccess', {
          type: this.translateService.instant('general.assessment')
        }));
    });
    }
    this.assessmentForm.reset();
  }

  public saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe((res) => {
      this.alertService.success(this.translateService.instant('assessmentBuilder.saveSuccess', {
        type: this.translateService.instant('general.assessment')
      }));
    });
  }

  public async formGroupToFormData(): Promise<FormData> {
    // if user upload an icon
    if (this.icon) {
      this.formData.append('icon', this.icon);
    }
    // if user doesn’t upload an icon (on edit mode: set default icon if no icon has been uploaded before)
    else if (!this.assessment?.icon) {
      await this.setDefaultIcon();
    }

    this.formData.append('title', this.assessmentForm.value.title);
    this.formData.append('grade', this.assessmentForm.value.grade);
    this.formData.append('subject', this.assessmentForm.value.subject);
    this.formData.append('language', this.assessmentForm.value.language);
    this.formData.append('country', this.assessmentForm.value.country);
    this.formData.append('private', this.assessmentForm.value.private);
    this.formData.append('archived', this.assessmentForm.value.archived);
    this.formData.append('downloadable', this.assessmentForm.value.downloadable);
    this.formData.append('sel_question', this.assessmentForm.value.sel_question);

    return this.formData;
  }

  public handleFileInput(event: File): void {
    this.icon = event;
    this.assessmentForm.patchValue({icon: this.icon});
  }

  public async setDefaultIcon(): Promise<void> {
    const imageName = this.iconOptions[Math.floor(Math.random() * this.iconOptions.length)];
    const imagePath = '../../../../assets/icons/' + imageName;
    await fetch(imagePath)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], imageName, {type: 'image/svg+xml'}))
      .then((file) => this.formData.append('icon', file));
  }

  public onSelectAssessment(): void {
    const assessment = this.selectAssessmentForm.controls.assessment.value;
    this.clone = true;
    this.setForm(assessment);
  }

  private async setForm(assessment: any): Promise<void> {
    this.selectAssessment = false;

    if (this.clone) {
      this.assessmentForm.markAsDirty();
      if (assessment.icon) {
        await this.iconToFile(assessment.icon);
      }
    }
    this.assessmentForm.setValue({
      title: assessment.title,
      grade: assessment.grade,
      subject: assessment.subject.toUpperCase(),
      language: assessment.language_code,
      country: assessment.country_code,
      private: assessment.private,
      icon: this.icon,
      archived: assessment.archived,
      downloadable: assessment.downloadable,
      sel_question: assessment.sel_question
    });
    if (this.assessment.topics_count > 0) {
      this.assessmentForm.controls.grade.disable();
      this.assessmentForm.controls.subject.disable();
    }
  }

  // When creating a new assessment based on an existing one: convert object from icon to file
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
}
