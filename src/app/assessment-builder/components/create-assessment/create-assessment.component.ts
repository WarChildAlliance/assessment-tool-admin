import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from 'src/app/core/services/assessment.service';
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
    private: new FormControl(''),
  });


  constructor(
    private assessmentService: AssessmentService,
  ) { }

  ngOnInit(): void {
  }

  createAssessment(): void {
    const formvalues = this.AssessmentForm.value;
    const AssessmentToCreate: any = {
      id: 0,
      title: formvalues.title,
      grade: formvalues.grade,
      subject: formvalues.subject,
      language: formvalues.language,
      country: formvalues.country,
      private: formvalues.private,
    };
    this.assessmentService.createAssessment(AssessmentToCreate).subscribe(res =>
      {
        // TODO put snackbar here
        console.log(res);
      });

  }
}
