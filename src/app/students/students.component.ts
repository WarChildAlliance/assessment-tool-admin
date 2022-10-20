import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/core/models/language.model';
import { User } from 'src/app/core/models/user.model';
import { Country } from '../core/models/country.model';
import { Group } from '../core/models/group.model';
import { StudentTableData } from '../core/models/student-table-data.model';
import { TableColumn } from '../core/models/table-column.model';
import { TableFilter } from '../core/models/table-filter.model';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { TopicAccessesBuilderComponent } from './topic-accesses-builder/topic-accesses-builder.component';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  private filtersData = { country: '', language: '', group: '', ordering: '-id' };

  public displayedColumns: TableColumn[] = [
    { key: 'full_name', name: 'general.studentName' },
    { key: 'username', name: 'students.studentCode', type: 'copy' },
    { key: 'group', name: 'general.group' },
    { key: 'student_grade', name: 'general.grade' },
    { key: 'login_url', name: 'students.studentLoginURL', label: 'username', type: 'link' },
    { key: 'assessments_count', name: 'students.activeAssessmentsNumber' },
    { key: 'completed_topics_count', name: 'students.completedTopicsNumber' },
    { key: 'last_session', name: 'general.lastLogin', type: 'date' },
    { key: 'language_name', name: 'general.language' },
    { key: 'country_name', name: 'general.country' },
    { key: 'is_active', name: 'students.active', type: 'boolean' }
  ];

  public studentsDataSource: MatTableDataSource<StudentTableData> =
    new MatTableDataSource([]);
  public selectedUsers = [];
  public studentToEdit: any;

  public countries: Country[] = [];
  public languages: Language[] = [];
  public groups: Group[] = [];

  public filters: TableFilter[];

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
      this.userService.getGroups()
    ]).subscribe(([countries, languages, groups]: [Country[], Language[], Group[]]) => {
      this.countries = countries;
      this.languages = languages;
      this.groups = groups;

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
        {
          key: 'group',
          name: 'general.group',
          type: 'select',
          options: [{ key: '', value: 'All' }].concat(
            groups.map((group) => ({
              key: group.id.toString(),
              value: group.name,
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
        const mappedStudentList = studentsList.map(student => ({
          ...student,
          login_url: `${environment.STUDENT_PORTAL_LOGIN_URL}?code=${student.username}`
        }));
        this.studentsDataSource = new MatTableDataSource(mappedStudentList);
      });
  }

  public onFiltersChange(data: { key: string | number; value: any }): void {
    this.filtersData[data.key] = data.value;

    this.getStudentTableList(this.filtersData);
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  public onSelectionChange(newSelection: User[]): void {
    this.selectedUsers = newSelection;
  }

  public onOpenDetails(id: string): void {
    this.router.navigate([`/students/${id}`]);
  }

  public deleteStudent(): void {
    // Check if all students can be deleted (have been inactive for more than 1 year)
    const studentsToDeleteInactive = this.selectedUsers.every(
      (student) => student.can_delete === true
    );

    if (studentsToDeleteInactive) {
      const studentTranslation = this.translateService.instant(
        this.selectedUsers.length > 1 ? 'general.students' : 'general.student'
      );
      const confirmDialog = this.dialog.open(ConfirmModalComponent, {
        data: {
          title:  this.translateService.instant('general.delete', {
            type: studentTranslation.toLocaleLowerCase()
          }),
          content: this.translateService.instant('general.simpleDeletePrompt', {
            type: studentTranslation.toLocaleLowerCase(),
            name: ''
          }),
          contentType: 'innerHTML',
          confirmColor: 'warn'
        }
      });

      confirmDialog.afterClosed().subscribe(res => {
        if (res) {
          const toDelete = this.selectedUsers.map(student => student.id.toString());
          const onDeleteCallback = (): void => {
            this.alertService.success(this.translateService.instant('general.deleteSuccess', {
              type: studentTranslation
            }));
            this.getStudentTableList(this.filtersData);
          };

          if (toDelete.length === 1) {
            this.userService.deleteStudent(toDelete[0]).subscribe(onDeleteCallback);
            return;
          }
          this.userService.deleteStudents(toDelete).subscribe(onDeleteCallback);
        }
      });
    } else {
      this.alertService.error(this.translateService.instant('students.statusError'));
    }
  }

  public openAssignTopicDialog(): void {
    // Check if all students share the same language and country
    if (
      this.selectedUsers.every(
        (student) =>
          student.country_code === this.selectedUsers[0].country_code &&
          student.language_code === this.selectedUsers[0].language_code
      )
    ) {
      this.dialog.open(TopicAccessesBuilderComponent, {
        data: {
          studentsList: this.selectedUsers
        }
      });
    } else {
      this.alertService.error(
        this.translateService.instant('students.incompatibleLanguageError')
      );
    }
  }

  public openCreateStudentDialog(): void {
    const createStudentDialog = this.dialog.open(StudentDialogComponent, {
      data: {
        studentList: this.studentsDataSource.data
      }
    });
    createStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentTableList(this.filtersData);
      }
    });
  }

  public openEditStudentDialog(): void {
    this.studentToEdit = this.selectedUsers[0];
    this.studentToEdit.group = this.groups.find(
      el => el.name === String(this.studentToEdit.group)
    )?.id.toString();

    const editStudentDialog = this.dialog.open(StudentDialogComponent, {
      data: {
        student: this.studentToEdit
      }
    });
    editStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentTableList(this.filtersData);
      }
      this.studentToEdit = null;
    });
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }
}
