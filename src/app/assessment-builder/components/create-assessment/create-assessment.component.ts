import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { Assessment } from '../../../core/models/assessment.model';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss']
})
export class CreateAssessmentComponent implements OnInit {

  @Input() assessment = null;
  public icon = null;

  public AssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(false),
  });


  public languages;
  public countries;
  public subjects = ['PRESEL', 'POSTSEL', 'MATH', 'LITERACY', 'TUTORIAL'];

  constructor(
    private assessmentService: AssessmentService,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.userService.getLanguages().subscribe( res => this.languages = res);
    this.userService.getCountries().subscribe( res => this.countries = res);
    if (this.assessment) {
      const a = this.assessment;
      this.AssessmentForm.setValue({title: a.title, grade: a.grade, subject: a.subject,
        language: a.language_code, country: a.country_code, private: a.private});
    }
  }

  createAssessment(): void {
    const formvalues = this.AssessmentForm.value;
    const formData: FormData = new FormData();
    formData.append('subject', formvalues.subject);
    formData.append('language', formvalues.language);
    formData.append('country', formvalues.country);
    formData.append('private', formvalues.private);
    formData.append('title', formvalues.title);
    formData.append('grade', formvalues.grade);
    if (this.icon) {
      formData.append('icon', this.icon);
    }


    if (this.assessment) {
      this.assessmentService.editAssessment(this.assessment.id, formData).subscribe(() => {
        this.alertService.success('Assessment was altered successfully');
      } );
    } else {
      this.assessmentService.createAssessment(formData).subscribe(() => {
        this.alertService.success('Assessment was saved successfully');
      });
    }
  }

  handleFileInput(event): void {
     this.icon = event.target.files[0];
  }


}
