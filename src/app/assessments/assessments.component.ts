import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Assessment } from '../core/models/assessment.model';
import { AssessmentService } from '../core/services/assessment.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../core/services/user.service';
import { Country } from '../core/models/country.model';
import { Language } from '../core/models/language.model';
import { TableColumn } from '../core/models/table-column.model';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'grade', name: 'Grade' },
    { key: 'subject', name: 'Subject' },
    { key: 'topics_count', name: 'Number of topics' },
    { key: 'students_count', name: 'Number of student linked to this assessment' },
    { key: 'language_name', name: 'Language' },
    { key: 'country_name', name: 'Country' },
    { key: 'private', name: 'Private', type:'boolean' }
  ];

  public searchableColumns = ['title', 'grade', 'subject', 'language_name', 'country_name'];

  public assessmentsDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);

  // Create a route to get the available subjects, languages & countries from the API
  public subjects: string[] = [];
  public grades: number[] = [];

  public countries: Country[] = [];
  public languages: Language[] = [];


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
    private assessmentService: AssessmentService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {

    // TODO See if we could reduce the number of lines here ?
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      assessmentsList.forEach((assessment) => {
        this.subjects.push(assessment.subject);
        this.grades.push(assessment.grade);
      });
      // This removes duplicates in the arrays
      this.subjects = [... new Set(this.subjects)];
      this.grades = [... new Set(this.grades)];
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });

    this.userService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
    this.userService.getLanguages().subscribe((languages) => {
      this.languages = languages;
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
