import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'username', 'first_name', 'last_name', 'language', 'country'];
  studentsList: User[] = [];
  user: User;
  countries = ['USA', 'JOR'];
  languages = ['ARA', 'ENG'];
  selection = new SelectionModel<User>(true, []);

  @ViewChild('createStudentDialog') createStudentDialog: TemplateRef<any>;

  createNewStudentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getSelf().subscribe(res => {
      this.user = res;
    });

    this.userService.studentsList.pipe(first()).subscribe((newList) => {
      this.studentsList = newList;
    });
    this.userService.getStudentsList();
  }

  openStudentDetails(id: string) {
    this.router.navigate([`/students/${id}`]);
  }

  openCreateStudentDialog() {
    this.dialog.open(this.createStudentDialog);
  }

  onSubmit() {
    const studentToCreate = {
      first_name: this.createNewStudentForm.value.first_name,
      last_name: this.createNewStudentForm.value.last_name,
      role: 'STUDENT',
      language: this.createNewStudentForm.value.language,
      country: this.createNewStudentForm.value.country
    }
    this.userService.createNewStudent(studentToCreate);
  }

  deleteSelection() {
    console.log("DEL", this.selection.selected);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.studentsList.length;
    return numSelected === numRows;
  }

  isNoneSelected() {
    return this.selection.selected.length == 0;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.studentsList.forEach(row => this.selection.select(row));
  }
}
