import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Country } from 'src/app/core/models/country.model';
import { Language } from 'src/app/core/models/language.model';
import { User } from 'src/app/core/models/user.model';
import { Group } from 'src/app/core/models/group.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { GroupDialogComponent } from '../../groups/group-dialog/group-dialog.component';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

interface DialogData {
  student?: any;
  studentList?: any;
}
@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit {

  public student: any;
  public studentList: any = [];

  // Defines if a student is edited or if a new one is created

  public hasFormChanged = false;

  public countries: Country[];
  public languages: Language[];
  public groups: Group[];
  public grades = ['1', '2', '3'];

  public studentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    language: new FormControl('', Validators.required),
    group: new FormControl(''),
    grade: new FormControl(''),
    active: new FormControl(true)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private userService: UserService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<StudentDialogComponent>
  ) { }

  ngOnInit(): void {
    if (this.data?.student) { this.student = this.data.student; }
    if (this.data?.studentList) { this.studentList = this.data.studentList ?? []; }
    if (!!this.student) {
      this.studentForm.setValue({
        first_name: this.student.first_name,
        last_name: this.student.last_name,
        country: this.student.country_code,
        language: this.student.language_code,
        group: this.student.group ?? '',
        active: this.student.is_active,
        grade: this.student.grade ?? '',
      });
    }

    forkJoin([
      this.userService.getCountries(),
      this.userService.getLanguages(),
      this.userService.getGroups()
    ]).subscribe(
      ([countries, languages, groups]: [Country[], Language[], Group[]]) => {
        this.countries = countries;
        this.languages = languages;
        this.groups = groups;
      }
    );
    this.studentForm.valueChanges.subscribe(() => { this.hasFormChanged = true; });
  }

  public async submitStudent(): Promise<void> {
    const studentToSave = {
      first_name: this.studentForm.value.first_name,
      last_name: this.studentForm.value.last_name,
      role: 'STUDENT',
      language: this.studentForm.value.language,
      country: this.studentForm.value.country,
      group: this.studentForm.value.group ?? '',
      is_active: this.studentForm.value.active,
      grade: this.studentForm.value.grade ?? '',
    };

    if (!!this.student) {
      this.userService.editStudent(this.student.id, studentToSave).subscribe((student: User) => {
        this.alertService.success(
          this.translateService.instant(
            'students.createStudentDialog.studentEditSuccess',
            {name: student.first_name + ' ' + student.last_name}
          )
        );
        this.dialogRef.close(true);
      }, error => {
        this.alertService.error(error.message);
        this.dialogRef.close(false);
      });
    } else {
      const canCreate = await this.checkStudentDuplication(studentToSave);

      if (canCreate) {
        this.userService.createNewStudent(studentToSave).subscribe((student: User) => {
          this.alertService.success(
            this.translateService.instant(
              'students.createStudentDialog.studentCreateSuccess',
              { name: student.first_name + ' ' + student.last_name, username: student.username }
            )
          );

          this.dialogRef.close(true);
        });
      }
    }
  }

  public openGroupDialog(): void {
    const groupDialog = this.dialog.open(GroupDialogComponent);
    groupDialog.afterClosed().subscribe((value: any) => {
      if (value) {
        this.getGroups(() => {
          this.studentForm.patchValue({
            group: this.groups.find(group => group.name === value.name).id.toString()
          });
        });
      }
    });
  }

  private getGroups(successCallback: CallableFunction = null): void {
    this.userService.getGroups()
      .subscribe((groups: Group[]) => {
        this.groups = groups;
        if (successCallback) {
          successCallback();
        }
      });
  }

  // Check student duplication on creation: based on name
  private async checkStudentDuplication(studentToSave: any): Promise<boolean | void> {
    let create = this.studentList?.length ? false : true;

    for (const student of this.studentList) {
      if (student.first_name.toLowerCase() === studentToSave.first_name.toLowerCase()
        && student.last_name.toLowerCase() === studentToSave.last_name.toLowerCase()) {

        // if similar name but different country/language show alert to confirm
        if (student.country_code !== studentToSave.country || student.language_code !== studentToSave.language) {
          const confirmDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: this.translateService.instant('students.createStudentDialog.nameExists'),
              content: this.translateService.instant('students.createStudentDialog.similarName',
                { name: student.full_name, country: student.country_name, language: student.language_name }),
              contentType: 'innerHTML',
              confirmColor: 'accent'
            }
          });

          confirmDialog.afterClosed().subscribe((res) => {
            // Cancel, don't create student with similiar name
            if (!res) {
              this.dialogRef.close(false);
              create = false;
            } else {
              // Create student anyway
              this.dialogRef.close(true);
              create = true;
            }
          });

          await confirmDialog.afterClosed().toPromise();
        } else {
          // if same country/language as well, avoid duplication
          this.alertService.warning(this.translateService.instant('students.createStudentDialog.duplicateName'));
          create = false;
        }
        break;
      } else {
        create = true;
      }
    }

    return create;
  }

}
