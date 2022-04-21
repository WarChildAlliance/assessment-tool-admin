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

  submitCreateNewAssessment(): void {
    const data = this.icon ? this.formData : this.createNewAssessmentForm.value;
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

  handleFileInput(event): void {
    this.icon = event.target.files[0];
    this.formData.append('icon', this.icon);
    this.formData.append('title', this.createNewAssessmentForm.value.title);
    this.formData.append('grade', this.createNewAssessmentForm.value.grade);
    this.formData.append('subject', this.createNewAssessmentForm.value.subject);
    this.formData.append('language', this.createNewAssessmentForm.value.language);
    this.formData.append('country', this.createNewAssessmentForm.value.country);
    this.formData.append('private', this.createNewAssessmentForm.value.private);

    this.createNewAssessmentForm.patchValue({icon: this.icon});
  }

}
