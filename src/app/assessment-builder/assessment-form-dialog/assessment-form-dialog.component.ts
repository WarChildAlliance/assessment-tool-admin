import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-assessment-form-dialog',
  templateUrl: './assessment-form-dialog.component.html',
  styleUrls: ['./assessment-form-dialog.component.scss']
})
export class AssessmentFormDialogComponent implements OnInit {

  @Input() edit: boolean;
  @Input() assessment;

  public icon = null;

  public languages;
  public countries;
  public subjects = ['PRESEL', 'POSTSEL', 'MATH', 'LITERACY'];
  public formData: FormData = new FormData();

  public iconOptions = ['flower_green.svg', 'flower_purple.svg', 'flower_cyan.svg'];

  public createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(false, [Validators.required]),
    icon: new FormControl(null),
  });

  constructor(private assessmentService: AssessmentService,
              private userService: UserService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.userService.getLanguages().subscribe(res => this.languages = res);
    this.userService.getCountries().subscribe(res => this.countries = res);
    if (this.edit) {
      this.createNewAssessmentForm.setValue({
        title: this.assessment.title,
        grade: this.assessment.grade,
        subject: this.assessment.subject.toUpperCase(),
        language: this.assessment.language_code,
        country: this.assessment.country_code,
        private: this.assessment.private,
        icon: this.icon,
      });
    }
  }

  async submitCreateNewAssessment(): Promise<void> {
    console.log('submit');
    const data = await this.formGroupToFormData();
    if (this.edit) {
      this.assessmentService.editAssessment(this.assessment.id, data).subscribe(() => {
        this.alertService.success('Assessment was altered successfully');
      });
    } else {
      this.assessmentService.createAssessment(data).subscribe(res => {
        this.alertService.success('Assessment was saved successfully');
    });
    }
    this.createNewAssessmentForm.reset();
  }

  saveAttachments(assessmentId: string, attachment, type: string, obj): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj).subscribe((res) => {
      this.alertService.success('Assessment was saved successfully');
    });
  }

  async formGroupToFormData(): Promise<FormData> {
    // if user upload an icon
    if (this.icon) {
      this.formData.append('icon', this.icon);
    }
    // if user doesn’t upload an icon (on edit mode: set default icon if no icon has been uploaded before)
    else if (!this.assessment?.icon) {
      await this.setDefaultIcon();
    }

    this.formData.append('title', this.createNewAssessmentForm.value.title);
    this.formData.append('grade', this.createNewAssessmentForm.value.grade);
    this.formData.append('subject', this.createNewAssessmentForm.value.subject);
    this.formData.append('language', this.createNewAssessmentForm.value.language);
    this.formData.append('country', this.createNewAssessmentForm.value.country);
    this.formData.append('private', this.createNewAssessmentForm.value.private);

    return this.formData;
  }

  handleFileInput(event): void {
    this.icon = event.target.files[0];
    this.createNewAssessmentForm.patchValue({icon: this.icon});
  }

   async setDefaultIcon(): Promise<void> {
    const imageName = this.iconOptions[Math.floor(Math.random() * this.iconOptions.length)];
    const imagePath = '../../../../assets/icons/' + imageName;
    await fetch(imagePath)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], imageName, {type: 'image/svg+xml'}))
      .then((file) => this.formData.append('icon', file));
   }
}
