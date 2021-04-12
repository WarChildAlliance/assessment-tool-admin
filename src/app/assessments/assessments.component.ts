import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Assessment } from '../core/models/assessment.model';
import { User } from '../core/models/user.model';
import { AssessmentService } from '../core/services/assessment.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  displayedColumns: string[] = ['title', 'grade', 'subject', 'language', 'country', 'private', 'arrow'];
  assessmentsList: Assessment[] = [];
  subjects = ['MATH', 'LITERACY'];
  countries = ['USA', 'JOR'];
  languages = ['ARA', 'ENG'];
  isAssessmentPrivate: boolean = false;

  user: User;

  @ViewChild('createAssessmentDialog') createAssessmentDialog: TemplateRef<any>;

  createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(''),
  });

  constructor(private assessmentService: AssessmentService, 
    private router: Router, 
    private userService: UserService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe(res => {
      this.assessmentsList = res;
    });
    this.userService.getSelf().subscribe(res => {
      this.user = res;
    });
  }

  openAssessmentDetails(id: string) {
    this.router.navigate([`/assessments/${id}`]);
  }

  openCreateAssessmentDialog() {
    this.dialog.open(this.createAssessmentDialog);
  }

  togglePrivate(event) {
    this.isAssessmentPrivate = event.checked
  }

  onSubmit() {
    const assessmentToCreate = {
      title: this.createNewAssessmentForm.value.title,
      grade: this.createNewAssessmentForm.value.grade,
      subject: this.createNewAssessmentForm.value.subject,
      language: this.createNewAssessmentForm.value.language,
      country: this.createNewAssessmentForm.value.country,
      private: this.isAssessmentPrivate,
      created_by: this.user.id
    }
    console.log('NEW ASSESSMENT: ', assessmentToCreate);
  }
}
