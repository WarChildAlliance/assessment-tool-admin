import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/models/user.model';
import { GroupTableData } from '../core/models/group-table-data.model';
import { StudentTableData, StudentSubMenuTableData, StudentActionsButtonsTableData } from '../core/models/student-table-data.model';
import { TableColumn } from '../core/models/table-column.model';
import { TableFilter } from '../core/models/table-filter.model';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { BreadcrumbService } from '../core/services/breadcrumb.service';
import { QuestionSetAccessesBuilderComponent } from '../shared/question-set-accesses-builder/question-set-accesses-builder.component';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit, OnDestroy {

  public displayedColumns: TableColumn[] = [
    { key: 'sel_overview', name: ' ', type: 'sel-overview' },
    { key: 'full_name', name: 'general.studentName' },
    { key: 'username', name: 'students.studentCode', type: 'copy' },
    { key: 'grade', name: 'general.grade' },
    { key: 'last_session', name: 'general.lastLogin', type: 'date' },
    { key: 'assessments', name: 'general.assessments', type: 'score-list' },
    { key: 'average_score', name: 'general.average', type: 'score' },
    { key: 'completed_questions_count', name: 'students.tasks' },
    { key: 'speed', name: 'general.speed', type: 'duration' },
    { key: 'honey', name: 'general.honey', type: 'customized-icon', icon: 'assets/icons/honey-pot.svg' },
    { key: 'subMenu', name: ' ', type: 'menu' }
  ];

  public studentsDataSource: MatTableDataSource<StudentTableData> =
    new MatTableDataSource([]);
  public selectedUsers = [];
  public studentToEdit: any;
  public filtersReset$ = new Subject<void>();
  public buttons = StudentActionsButtonsTableData;
  public groups: GroupTableData[] = [];
  public filters: TableFilter[] = [];

  public createNewStudentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  private filtersData = { group: '', ordering: '-id' };

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    this.userService.getGroupsDetails().subscribe((groups: GroupTableData[]) => {
      this.groups = groups;

      if (this.groups.length) {
        const baseOpts = groups.length > 5 ? [{key: 'All', value: ''}] : [];

        this.filters = [{
          key: 'group',
          name: 'general.group',
          type: 'select',
          options: baseOpts.concat(groups.map((group) => ({
              key: group.name,
              value: group.id.toString(),
            }))
          ),
        }];
      }
      this.filters.forEach(filter => {
        this.translateService.stream(filter.name).subscribe(translated => filter.name = translated);
      });
    });
    this.getStudentTableList(false, this.filtersData);
  }

  public onFiltersChange(data: { key: string | number; value: string }): void {
    this.filtersData[data.key] = data.value;
    this.getStudentTableList(false, this.filtersData);

    if (data.key === 'group') {
      this.breadcrumbService.componentData = data.value ?
        this.groups.find((group) => group.id === parseInt(data.value, 10)):
        null;
    }
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  public onSelectionChange(newSelection: User[]): void {
    this.selectedUsers = newSelection;
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
            this.getStudentTableList(false, this.filtersData);
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

  public openAssignQuestionSetDialog(): void {
    // Check if all students share the same language and country
    if (
      this.selectedUsers.every(
        (student) =>
          student.country_code === this.selectedUsers[0].country_code &&
          student.language_code === this.selectedUsers[0].language_code
      )
    ) {
      this.dialog.open(QuestionSetAccessesBuilderComponent, {
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
    const createStudentDialog = this.dialog.open(StudentDialogComponent);
    createStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentTableList(false, this.filtersData);
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
        this.getStudentTableList(false, this.filtersData);
      }
      this.studentToEdit = null;
    });
  }

  public onCompare() {
    console.log('Compare');
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }

  public subMenuAction(selected: any): void {
    this.selectedUsers = [selected.element];
    this[selected.action]();
  }

  public actionButton(action: any): void {
    this[action]();
  }

  public getStudentTableList(resetFilters?: boolean, filtersData?: object): void {
    if (resetFilters) {
      this.filtersData = { group: '', ordering: '-id' };
    }
    this.userService
      .getStudentsList(filtersData)
      .subscribe((studentsList: StudentTableData[]) => {
        const mappedStudentList = studentsList.map(student => ({
          ...student,
          subMenu: StudentSubMenuTableData,
        }));
        this.studentsDataSource = new MatTableDataSource(mappedStudentList);
      });
  }

  ngOnDestroy(): void {
    this.breadcrumbService.componentData = null;
  }
}
