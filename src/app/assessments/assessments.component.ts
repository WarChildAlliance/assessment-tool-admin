import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    { key: 'title', name: 'general.title' },
    { key: 'grade', name: 'general.grade' },
    { key: 'subject', name: 'general.subject' },
    { key: 'topics_count', name: 'assessments.topicsNumber' },
    { key: 'students_count', name: 'assessments.studentsLinkedToAssessment' },
    { key: 'language_name', name: 'general.language' },
    { key: 'country_name', name: 'general.country' },
    { key: 'private', name: 'general.private', type: 'boolean' }
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
    private translateService: TranslateService,
    private userService: UserService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    forkJoin([this.userService.getCountries(), this.userService.getLanguages()]).subscribe(
      ([countries, languages]: [Country[], Language[]]) => {
        this.filters = [
          {
            key: 'country',
            name: 'general.country',
            type: 'select',
            options: [{ key: '', value: 'All' }].concat(countries.map(country => ({ key: country.code, value: country.name_en })))
          },
          {
            key: 'language',
            name: 'general.language',
            type: 'select',
            options: [{ key: '', value: 'All' }].concat(languages.map(language => ({ key: language.code, value: language.name_en })))
          }
        ];
        this.filters.forEach(filter => {
          this.translateService.stream(filter.name).subscribe(translated => filter.name = translated);
        });
      }
    );

    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }

  public onFiltersChange(data: { key: string | number, value: any }): void {
    this.filtersData[data.key] = data.value;

    this.assessmentService.getAssessmentsList(this.filtersData).subscribe((assessmentsList) => {
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
    });
  }

  public onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${id}`]);
  }

  public togglePrivate(event: { checked: boolean; }): void {
    this.isAssessmentPrivate = event.checked;
  }

  public deleteSelection(): void {
    console.log('DEL');
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }
}
