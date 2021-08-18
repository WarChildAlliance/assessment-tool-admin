import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Country } from 'src/app/core/models/country.model';
import { Language } from 'src/app/core/models/language.model';
import { User } from 'src/app/core/models/user.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-create-student-dialog',
  templateUrl: './create-student-dialog.component.html',
  styleUrls: ['./create-student-dialog.component.scss']
})
export class CreateStudentDialogComponent implements OnInit {

  @Input() newStudent: any;

  // Defines if a student is edited or if a new one is created
  private isStudentEdited = false;

  countries: Country[];
  languages: Language[];

  public createNewStudentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    if (!!this.newStudent) {
      this.isStudentEdited = true;

      this.createNewStudentForm.setValue({
        first_name: this.newStudent.full_name.split(' ')[0],
        last_name: this.newStudent.full_name.split(' ')[1],
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