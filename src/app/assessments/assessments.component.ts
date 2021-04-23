import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Assessment } from '../core/models/assessment.model';
import { AssessmentService } from '../core/services/assessment.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'title', value: 'Title' },
    { key: 'grade', value: 'Grade' },
    { key: 'subject', value: 'Subject' },
    { key: 'language', value: 'Language' },
    { key: 'country', value: 'Country' }
  ];

  public filterableColumns = ["title", "grade", "subject", "language", "country"];

  public assessmentsDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);

  // Create a route to get the available subjects, languages & countries from the API
  public subjects = ['MATH', 'LITERACY'];
  public countries = ['USA', 'JOR', 'FRA'];
  public languages = ['ARA', 'ENG', 'FRE'];

  public isAssessmentPrivate = false;

  @ViewChild('createAssessmentDialog') createAssessmentDialog: TemplateRef<any>;

  public createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(''),
  });

  constructor(
    private assessmentService: AssessmentService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {

    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${id}`]);
  }

  openCreateAssessmentDialog(): void {
    this.dialog.open(this.createAssessmentDialog);
  }

  togglePrivate(event: { checked: boolean; }): void {
    this.isAssessmentPrivate = event.checked;
  }

  deleteSelection(): void {
    console.log('DEL');
  }

  downloadData(): void {
    console.log('Work In Progress');
  }

  submitCreateNewAssessment(): void {
    const assessmentToCreate = {
      title: this.createNewAssessmentForm.value.title,
      grade: this.createNewAssessmentForm.value.grade,
      subject: this.createNewAssessmentForm.value.subject,
      language: this.createNewAssessmentForm.value.language,
      country: this.createNewAssessmentForm.value.country,
      private: this.isAssessmentPrivate
    };
    console.log('NEW ASSESSMENT: ', assessmentToCreate);
  }
}
