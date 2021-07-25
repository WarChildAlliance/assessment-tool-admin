import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public subjects = ['PRESEL', 'POSTSEL', 'MATH', 'LITERACY'];

  constructor(
    private assessmentService: AssessmentService,
    private userService: UserService
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
    if (this.assessment) {
      this.assessmentService.editAssessment(this.assessment.id, formvalues).subscribe(res => console.log('todo make snackbar', res) );
    } else {
      this.assessmentService.createAssessment(formvalues).subscribe(res => console.log('todo make snackbar', res) );
    }
  }
}
