import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'username', value: 'Username' },
    { key: 'first_name', value: 'First name' },
    { key: 'last_name', value: 'Last name' },
    { key: 'language', value: 'Language' },
    { key: 'country', value: 'Country' }
  ];

  public filterableColumns = ['username', 'first_name', 'last_name', 'language', 'country'];

  public studentsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public selectedUsers: User[] = [];

  // Create a route to get the available languages & countries from the API
  public countries = ['USA', 'JOR', 'FRA'];
  public languages = ['ARA', 'ENG', 'FRE'];

  private filteringOptions = {
    country: '',
    language: ''
  };

  @ViewChild('createStudentDialog') createStudentDialog: TemplateRef<any>;
  @ViewChild('assignTopicDialog') assignTopicDialog: TemplateRef<any>;

  public createNewStudentForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService, private alertService: AlertService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getStudentsList().subscribe((studentsList) => {

      // Here we have to extract the wanted value from nested object because for now the
      // way we use in table componenent MatTableDataSource only accepts simple objects.
      let studentsListCleaned = [];

      studentsList.forEach((student) => {
        let studentCleaned = student as any;
        studentCleaned['language'] = student.language.name_en
        studentsListCleaned.push(studentCleaned);
      })

      this.studentsDataSource = new MatTableDataSource(studentsListCleaned);
    });
  }

  applySelectFilters(param: string, $event): void {

    this.filteringOptions[param] = $event.value;

    this.userService.getStudentsList(this.filteringOptions).subscribe((filteredStudentsList) => {
      this.studentsDataSource = new MatTableDataSource(filteredStudentsList);
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: User[]): void {
    console.log('Students selection changed !');
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
    if (!this.selectedUsers.every((student) => (
      student.country === this.selectedUsers[0].country && student.language === this.selectedUsers[0].language
    ))) {
      this.alertService.error('You can only give access to a topic to students with the same country and language.');
    } else {
      this.dialog.open(this.assignTopicDialog);
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
      language: this.createNewStudentForm.value.language,
      country: this.createNewStudentForm.value.country
    };
    this.userService.createNewStudent(studentToCreate).subscribe((student: User) => {
      this.alertService.success(`Student ${student.first_name + ' ' + student.last_name} with ID ${student.username} was successfully created`);
      this.studentsDataSource.data.push(student);
      this.studentsDataSource.data = this.studentsDataSource.data;
      this.createNewStudentForm.reset();
    });
  }
}
