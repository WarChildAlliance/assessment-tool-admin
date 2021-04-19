import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Assessment } from '../core/models/assessment.model';
import { User } from '../core/models/user.model';
import { AssessmentService } from '../core/services/assessment.service';
import { UserService } from '../core/services/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  user: User;

  displayedColumns: string[] = ['select', 'title', 'grade', 'subject', 'language', 'country', 'private'];
  assessmentsDataSource: MatTableDataSource<Assessment> = new MatTableDataSource([]);

  subjects = ['MATH', 'LITERACY'];
  countries = ['USA', 'JOR'];
  languages = ['ARA', 'ENG'];

  isAssessmentPrivate = false;
  selection = new SelectionModel<Assessment>(true, []);

  @ViewChild('createAssessmentDialog') createAssessmentDialog: TemplateRef<any>;
  @ViewChild(MatSort) assessmentsSort: MatSort;

  createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    private: new FormControl(''),
  });

  constructor(
    private assessmentService: AssessmentService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getSelf().subscribe(res => {
      this.user = res;
    });

    this.assessmentService.assessmentsList.pipe(first()).subscribe((assessmentsList) => {
      this.assessmentsDataSource = new MatTableDataSource(assessmentsList);
      this.assessmentsDataSource.sort = this.assessmentsSort;
    });
    this.assessmentService.getAssessmentsList();
  }

  openAssessmentDetails(id: string): void {
    this.router.navigate([`/assessments/${id}`]);
  }

  openCreateAssessmentDialog(): void {
    this.dialog.open(this.createAssessmentDialog);
  }

  togglePrivate(event: { checked: boolean; }): void {
    this.isAssessmentPrivate = event.checked;
  }

  deleteSelection(): void {
    console.log('DEL', this.selection.selected);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.assessmentsDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.assessmentsDataSource.filteredData.forEach(
        ass => {
          this.selection.select(ass);
        });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.assessmentsDataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(): void {
    const assessmentToCreate = {
      title: this.createNewAssessmentForm.value.title,
      grade: this.createNewAssessmentForm.value.grade,
      subject: this.createNewAssessmentForm.value.subject,
      language: this.createNewAssessmentForm.value.language,
      country: this.createNewAssessmentForm.value.country,
      private: this.isAssessmentPrivate,
      created_by: this.user.id
    };
    console.log('NEW ASSESSMENT: ', assessmentToCreate);
  }
}
