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

  public searchableColumns = ['title', 'grade', 'subject', 'language', 'country'];

  public assessmentsDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);

  // Create a route to get the available subjects, languages & countries from the API
  public subjects: string[] = [];
  public countries: string[] = [];
  public languages: string[] = [];
  public grades: number[] = [];

  private filteringParams = {
    subject: '',
    grade: '',
    country: '',
    language: ''
  };

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
    private assessmentService: AssessmentService, private router: Router) { }

  ngOnInit(): void {

    // TODO See if we could reduce the number of lines here ?
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      assessmentsList.forEach((assessment) => {
        this.subjects.push(assessment.subject);
        this.countries.push(assessment.country);
        this.languages.push(assessment.language);
        this.grades.push(assessment.grade);
      });
      // This removes duplicates in the arrays
      this.subjects = [... new Set(this.subjects)];
      this.countries = [... new Set(this.countries)];
      this.languages = [... new Set(this.languages)];
      this.grades = [... new Set(this.grades)];
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }

  applySelectFilters(param: string, $event): void {
    this.filteringParams[param] = $event.value;
    this.assessmentService.getAssessmentsList(this.filteringParams).subscribe((filteredAssessmentsList) => {
      this.assessmentsDataSource = new MatTableDataSource(filteredAssessmentsList);
    });
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${id}`]);
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
}
