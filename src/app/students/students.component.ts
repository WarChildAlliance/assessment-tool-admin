import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/core/models/language.model';
import { User } from 'src/app/core/models/user.model';
import { Country } from '../core/models/country.model';
import { StudentTableData } from '../core/models/student-table-data.model';
import { TableColumn } from '../core/models/table-column.model';
import { TableFilter } from '../core/models/table-filter.model';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { CreateStudentDialogComponent } from './create-student-dialog/create-student-dialog.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  public displayedColumns: TableColumn[] = [
    { key: 'full_name', name: 'general.studentName' },
    { key: 'username', name: 'students.studentCode', type: 'copy' },
    { key: 'assessments_count', name: 'students.activeAssessmentsNumber' },
    { key: 'completed_topics_count', name: 'students.completedTopicsNumber' },
    { key: 'last_session', name: 'general.lastLogin', type: 'date' },
    { key: 'language_name', name: 'general.language' },
    { key: 'country_name', name: 'general.country' },
  ];

  public studentsDataSource: MatTableDataSource<StudentTableData> =
    new MatTableDataSource([]);
  public selectedUsers = [];
  public studentToEdit: any;

  public countries: Country[] = [];
  public languages: Language[] = [];

  public filters: TableFilter[];
  private filtersData = { country: '', language: '', ordering: '-id' };

  @ViewChild('assignTopicDialog') assignTopicDialog: TemplateRef<any>;

  public createNewStudentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    forkJoin([
      this.userService.getCountries(),
      this.userService.getLanguages(),
    ]).subscribe(([countries, languages]: [Country[], Language[]]) => {
      this.countries = countries;
      this.languages = languages;
      this.filters = [
        {
          key: 'country',
          name: 'general.country',
          type: 'select',
          options: [{ key: '', value: 'All' }].concat(
            countries.map((country) => ({
              key: country.code,
              value: country.name_en,
            }))
          ),
        },
        {
          key: 'language',
          name: 'general.language',
          type: 'select',
          options: [{ key: '', value: 'All' }].concat(
            languages.map((language) => ({
              key: language.code,
              value: language.name_en,
            }))
          ),
        },
      ];
      this.filters.forEach(filter => {
        this.translateService.stream(filter.name).subscribe(translated => filter.name = translated);
      });
    });
    this.getStudentTableList(this.filtersData);
  }

  private getStudentTableList(filtersData?): void {
    this.userService
      .getStudentsList(filtersData)
      .subscribe((studentsList: StudentTableData[]) => {
        this.studentsDataSource = new MatTableDataSource(studentsList);
      });
  }

  onFiltersChange(data: { key: string | number; value: any }): void {
    this.filtersData[data.key] = data.value;

    this.getStudentTableList(this.filtersData);
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: User[]): void {
    this.selectedUsers = newSelection;
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/students/${id}`]);
  }

  openAssignTopicDialog(): void {
    // Check if all students share the same language and country
    if (
      this.selectedUsers.every(
        (student) =>
          student.country_code === this.selectedUsers[0].country_code &&
          student.language_code === this.selectedUsers[0].language_code
      )
    ) {
      this.dialog.open(this.assignTopicDialog);
    } else {
      this.alertService.error(
        'You can only give access to a topic to students with the same country and language.'
      );
    }
  }

  openCreateStudentDialog(): void {
    const createStudentDialog = this.dialog.open(CreateStudentDialogComponent);
    createStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentTableList(this.filtersData);
      }
    });
  }

  openEditStudentDialog(): void {
    this.studentToEdit = this.selectedUsers[0];
    const editStudentDialog = this.dialog.open(CreateStudentDialogComponent, {
      data: {
        newStudent: this.studentToEdit
      }
    });
    editStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentTableList(this.filtersData);
      }
      this.studentToEdit = null;
    });
  }

  deleteSelection(): void {
    console.log('DEL', this.selectedUsers);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }
}
