import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Country } from 'src/app/core/models/country.model';
import { Language } from 'src/app/core/models/language.model';
import { User } from 'src/app/core/models/user.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  newStudent?: any;
}
@Component({
  selector: 'app-create-student-dialog',
  templateUrl: './create-student-dialog.component.html',
  styleUrls: ['./create-student-dialog.component.scss']
})
export class CreateStudentDialogComponent implements OnInit {

  public newStudent: any;

  // Defines if a student is edited or if a new one is created
  public isStudentEdited = false;

  public formChanges = false;

  countries: Country[];
  languages: Language[];

  public createNewStudentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+(-[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+)?$')]),
    last_name: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+(-[A-Za-zÀ-ÖØ-öø-ÿ\u0621-\u064A]+)?$')]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if (this.data?.newStudent) { this.newStudent = this.data.newStudent; }
    if (!!this.newStudent) {
      this.isStudentEdited = true;

      this.createNewStudentForm.setValue({
        first_name: this.newStudent.first_name,
        last_name: this.newStudent.last_name,
        country: this.newStudent.country_code,
        language: this.newStudent.language_code,
      });
    }

    forkJoin([this.userService.getCountries(), this.userService.getLanguages()]).subscribe(
      ([countries, languages]: [Country[], Language[]]) => {
        this.countries = countries;
        this.languages = languages;
      }
    );

    this.createNewStudentForm.valueChanges.subscribe(() => { this.formChanges = true; });
  }

  submitCreateNewStudent(): void {
    const studentToCreate = {
      first_name: this.createNewStudentForm.value.first_name,
      last_name: this.createNewStudentForm.value.last_name,
      role: 'STUDENT',
      language: this.createNewStudentForm.value.language,
      country: this.createNewStudentForm.value.country
    };

    if (this.isStudentEdited) {
      this.userService.editStudent(this.newStudent.id, studentToCreate).subscribe((student: User) => {
        this.alertService.success(`${student.first_name + ' ' + student.last_name}'s information have been edited successfully `);
      });
    } else {
      this.userService.createNewStudent(studentToCreate).subscribe((student: User) => {
        this.alertService.success(`Student ${student.first_name + ' ' + student.last_name} with ID ${student.username} was successfully created`);
      });
    }

    this.createNewStudentForm.reset();
  }
}
