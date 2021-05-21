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
import { TableFilter } from '../core/models/table-filter.model';
import { forkJoin } from 'rxjs';

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
    { key: 'private', name: 'Private', type: 'boolean' }
  ];

  public assessmentsDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);


  public filters: TableFilter[];
  private filtersData = { country: '', language: '' };

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
    private userService: UserService
  ) { }

  ngOnInit(): void {
    forkJoin([this.userService.getCountries(), this.userService.getLanguages()]).subscribe(
      ([countries, languages]: [Country[], Language[]]) => {
        this.filters = [
          {
            key: 'country',
            name: 'Country',
            type: 'select',
            options: [{ key: '', value: 'All' }].concat(countries.map(country => ({ key: country.code, value: country.name_en })))
          },
          {
            key: 'language',
            name: 'Language',
            type: 'select',
            options: [{ key: '', value: 'All' }].concat(languages.map(language => ({ key: language.code, value: language.name_en })))
          }
        ];
      }
    );

    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }

  onFiltersChange(data: { key: string | number, value: any }): void {
    this.filtersData[data.key] = data.value;

    this.assessmentService.getAssessmentsList(this.filtersData).subscribe((assessmentsList) => {
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
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
