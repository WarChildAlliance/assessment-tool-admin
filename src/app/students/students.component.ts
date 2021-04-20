import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  user: User;
  studentsList: User [];
  displayedColumns: string[] = ['select', 'username', 'first_name', 'last_name', 'language', 'country'];
  studentsDataSource: MatTableDataSource<User> = new MatTableDataSource([])

  countries = ['USA', 'JOR'];
  languages = ['ARA', 'ENG'];
  selection = new SelectionModel<User>(true, []);

  @ViewChild('createStudentDialog') createStudentDialog: TemplateRef<any>;
  @ViewChild('assignTopicDialog') assignTopicDialog: TemplateRef<any>
  @ViewChild(MatSort) studentsSort: MatSort;

  createNewStudentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService, private alertService: AlertService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getSelf().subscribe(res => {
      this.user = res;
    });
    this.userService.getStudentsList().subscribe((studentsList) => {
      this.studentsList = studentsList;
      this.studentsDataSource = new MatTableDataSource(this.studentsList);
      this.studentsDataSource.sort = this.studentsSort;
    });
  }

  openStudentDetails(id: string): void {
    this.router.navigate([`/students/${id}`]);
  }

  openCreateStudentDialog(): void {
    this.dialog.open(this.createStudentDialog);
  }

  onSubmit(): void {
    const studentToCreate = {
      first_name: this.createNewStudentForm.value.first_name,
      last_name: this.createNewStudentForm.value.last_name,
      role: 'STUDENT',
      language: this.createNewStudentForm.value.language,
      country: this.createNewStudentForm.value.country
    };
    this.userService.createNewStudent(studentToCreate).subscribe((res) => {
      this.alertService.success(`Student ${res.first_name + ' ' + res.last_name} with ID ${res.username} was successfully created`);
      this.studentsList.push(res);
      this.studentsDataSource = new MatTableDataSource(this.studentsList);
    });
  }

  deleteSelection(): void {
    console.log('DEL', this.selection.selected);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.studentsDataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.studentsDataSource.data.length;
    return numSelected === numRows;
  }

  isNoneSelected(): boolean {
    return this.selection.selected.length === 0;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.studentsDataSource.filteredData.forEach(
        student => {
          this.selection.select(student);
        });
  }

  openAssignTopicDialog() {
    this.dialog.open(this.assignTopicDialog);
  }
}
