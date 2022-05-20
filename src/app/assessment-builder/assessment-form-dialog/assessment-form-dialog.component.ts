import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { Language } from 'src/app/core/models/language.model';
import { Country } from 'src/app/core/models/country.model';

interface DialogData {
  edit?: boolean;
  assessment?: any;
}
@Component({
  selector: 'app-assessment-form-dialog',
  templateUrl: './assessment-form-dialog.component.html',
  styleUrls: ['./assessment-form-dialog.component.scss']
})
export class AssessmentFormDialogComponent implements OnInit {

  public edit: boolean;
  public assessment: any;

  public icon: File = null;

  public grades = [
    'general.grades.0',
    'general.grades.1',
    'general.grades.2',
    'general.grades.3',
    'general.grades.4',
    'general.grades.5',
    'general.grades.6',
    'general.grades.7',
    'general.grades.8',
    'general.grades.9',
    'general.grades.10',
    'general.grades.11',
    'general.grades.12'
  ];

  public languages: Language[];
  public countries: Country[];
  public subjects = ['PRESEL', 'POSTSEL', 'MATH', 'LITERACY'];
  public formData: FormData = new FormData();

  public iconOptions = ['flower_green.svg', 'flower_purple.svg', 'flower_cyan.svg'];

  public assessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(false, [Validators.required]),
    icon: new FormControl(null),
    archived: new FormControl(false)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translateService: TranslateService,
    private assessmentService: AssessmentService,
    private userService: UserService,
    private alertService: AlertService
    ) {}

  ngOnInit(): void {
    if (this.data?.assessment) { this.assessment = this.data.assessment; }
    if (this.data?.edit) { this.edit = this.data.edit; }
    this.userService.getLanguages().subscribe((res: Language[]) => this.languages = res);
    this.userService.getCountries().subscribe((res: Country[]) => this.countries = res);
    if (this.edit) {
      this.assessmentForm.setValue({
        title: this.assessment.title,
        grade: this.assessment.grade,
        subject: this.assessment.subject.toUpperCase(),
        language: this.assessment.language_code,
        country: this.assessment.country_code,
        private: this.assessment.private,
        icon: this.icon,
        archived: this.assessment.archived
      });
    }
  }

  public async saveAssessment(): Promise<void> {
    const data = await this.formGroupToFormData();
    if (this.edit) {
      this.assessmentService.editAssessment(this.assessment.id, data).subscribe(() => {
        this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentEditSuccess'));
      });
    } else {
      this.assessmentService.createAssessment(data).subscribe(res => {
        this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentSaveSuccess'));
    });
    }
    this.assessmentForm.reset();
  }

  public saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe((res) => {
      this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentSaveSuccess'));
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
}
