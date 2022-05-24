import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Country } from 'src/app/core/models/country.model';
import { Language } from 'src/app/core/models/language.model';
import { User } from 'src/app/core/models/user.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  student?: any;
}
@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit {

  public student: any;

  // Defines if a student is edited or if a new one is created

  public hasFormChanged = false;

  public countries: Country[];
  public languages: Language[];

  public studentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+(-[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+)?$')]),
    last_name: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+(-[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+)?$')]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translateService: TranslateService,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if (this.data?.student) { this.student = this.data.student; }
    if (!!this.student) {
      this.studentForm.setValue({
        first_name: this.student.first_name,
        last_name: this.student.last_name,
        country: this.student.country_code,
        language: this.student.language_code,
      });
    }

    forkJoin([this.userService.getCountries(), this.userService.getLanguages()]).subscribe(
      ([countries, languages]: [Country[], Language[]]) => {
        this.countries = countries;
        this.languages = languages;
      }
    );

    this.studentForm.valueChanges.subscribe(() => { this.hasFormChanged = true; });
  }

  public submitStudent(): void {
    const studentToSave = {
      first_name: this.studentForm.value.first_name,
      last_name: this.studentForm.value.last_name,
      role: 'STUDENT',
      language: this.studentForm.value.language,
      country: this.studentForm.value.country
    };

    if (!!this.student) {
      this.userService.editStudent(this.student.id, studentToSave).subscribe((student: User) => {
        this.alertService.success(
          this.translateService.instant(
            'students.createStudentDialog.studentEditSuccess',
            {name: student.first_name + ' ' + student.last_name}
          )
        );
      });
    } else {
      this.userService.createNewStudent(studentToSave).subscribe((student: User) => {
        this.alertService.success(
          this.translateService.instant(
            'students.createStudentDialog.studentCreateSuccess',
            {name: student.first_name + ' ' + student.last_name, username: student.username}
          )
        );
      });
    }

    this.studentForm.reset();
  }
}
