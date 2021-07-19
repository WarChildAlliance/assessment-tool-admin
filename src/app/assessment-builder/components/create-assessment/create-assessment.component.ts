import { Component, OnInit } from '@angular/core';
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

  public AssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(false),
  });


  public languages;
  public countries;


  constructor(
    private assessmentService: AssessmentService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getLanguages().subscribe( res =>
      {
        this.languages = res;
      });

    this.userService.getCountries().subscribe( res =>
        {
          this.countries = res;
      });
  }

  createAssessment(): void {
    const formvalues = this.AssessmentForm.value;

    this.assessmentService.createAssessment(formvalues).subscribe(res =>
      {
        // TODO put snackbar here
        console.log(res);
      });

  }
}
