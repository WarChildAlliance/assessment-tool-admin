import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Language } from 'src/app/core/models/language.model';
import { User } from 'src/app/core/models/user.model';
import { Country } from '../core/models/country.model';
import { StudentTableData } from '../core/models/student-table-data.model';
import { TableColumn } from '../core/models/table-column.model';
import { TableFilter } from '../core/models/table-filter.model';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  public displayedColumns: TableColumn[] = [
    { key: 'username', name: 'Student code'},
    { key: 'full_name', name: 'Student name' },
    { key: 'assessments_count', name: 'Total number of assessments' },
    { key: 'completed_topics_count', name: 'Total number of completed topics' },
    { key: 'last_session', name: 'Last session', type: 'date' },
    { key: 'language_name', name: 'Language' },
    { key: 'country_name', name: 'Country' }
  ];

  public studentsDataSource: MatTableDataSource<StudentTableData> = new MatTableDataSource([]);
  public selectedUsers = [];

  public countries: Country[] = [];
  public languages: Language[] = [];

  public filters: TableFilter[];
  private filtersData = { country: '', language: '' };

  @ViewChild('createStudentDialog') createStudentDialog: TemplateRef<any>;
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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    forkJoin([this.userService.getCountries(), this.userService.getLanguages()]).subscribe(
      ([countries, languages]: [Country[], Language[]]) => {
        this.countries = countries;
        this.languages = languages;
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

    this.userService.getStudentsList().subscribe((studentsList: StudentTableData[]) => {
      console.log('STU LIST', studentsList);
      this.studentsDataSource = new MatTableDataSource(studentsList);
    });
  }

  onFiltersChange(data: { key: string | number, value: any }): void {
    this.filtersData[data.key] = data.value;

    this.userService.getStudentsList(this.filtersData).subscribe((studentsList) => {
      this.studentsDataSource = new MatTableDataSource(studentsList);
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: User[]): void {
    this.selectedUsers = newSelection;
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/students/${id}`]);
  }

  onCloseTopicsDialogEvent(): void {
    this.dialog.closeAll();
  }

  openAssignTopicDialog(): void {
    // Check if all students share the same language and country
    if (this.selectedUsers.every((student) => (
      student.country_code === this.selectedUsers[0].country_code && student.language_code === this.selectedUsers[0].language_code
    ))) {
      this.dialog.open(this.assignTopicDialog);
    } else {
      this.alertService.error('You can only give access to a topic to students with the same country and language.');
    }
  }

  openCreateStudentDialog(): void {
    this.dialog.open(this.createStudentDialog);
  }

  deleteSelection(): void {
    console.log('DEL', this.selectedUsers);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }

  submitCreateNewStudent(): void {
    const studentToCreate = {
      first_name: this.createNewStudentForm.value.first_name,
      last_name: this.createNewStudentForm.value.last_name,
      role: 'STUDENT',
      language: this.createNewStudentForm.value.language.code, // TODO Do we really want to only send the code ? Why the code precisely ?
      country: this.createNewStudentForm.value.country.code
    };
    this.userService.createNewStudent(studentToCreate).subscribe((student: User) => {
      this.alertService.success(`Student ${student.first_name + ' ' + student.last_name} with ID ${student.username} was successfully created`);
      this.createNewStudentForm.reset();
    });
    this.userService.getStudentsList().subscribe((studentsList) => {
      this.studentsDataSource = new MatTableDataSource(studentsList);
    });
  }
}
