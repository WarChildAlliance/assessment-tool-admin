import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Assessment } from 'src/app/core/models/assessment.model';
import { BatchQuestionSetAccesses } from 'src/app/core/models/batch-question-set-accesses.model';
import { QuestionSetTableData } from 'src/app/core/models/question-set-table-data.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/core/models/group.model';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

interface DialogData {
  studentsList?: any[];
  groupsList?: any[];
  assessment?: any;
}

@Component({
  selector: 'app-question-set-accesses-builder',
  templateUrl: './question-set-accesses-builder.component.html',
  styleUrls: ['./question-set-accesses-builder.component.scss']
})

export class QuestionSetAccessesBuilderComponent implements OnInit {

  public groupsList: Group[] = [];
  public libraryAssessment: boolean;

  public minDate: Date = new Date();
  public studentsList: any[] = [];
  public assessmentsList: Assessment[] = [] ;
  public assessment: Assessment;
  public startDate: Date;
  public endDate: Date;

  public assignQuestionSetForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  public assignGroupForm: FormGroup = new FormGroup({
    groups: new FormArray([])
  });

  public assignStudentsForm: FormGroup = new FormGroup({
    students: new FormArray([])
  });

  private questionSetsList: QuestionSetTableData[] = [];
  private selectedAssessmentId: string;
  private applyToAllQuestionSets: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private assessmentService: AssessmentService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private utilitiesService: UtilitiesService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {}

  get questionSetControls(): AbstractControl[] {
    return (this.assignQuestionSetForm.get('access') as FormArray).controls;
  }

  get groupControls(): AbstractControl[] {
    return (this.assignGroupForm.get('groups') as FormArray).controls;
  }

  get studentControls(): AbstractControl[] {
    return (this.assignStudentsForm.get('students') as FormArray).controls;
  }

  get disabledAssign(): boolean {
    let studentsSelected = false;
    if ((this.data.studentsList && !this.data.studentsList.length) || this.libraryAssessment) {
      studentsSelected = this.assignGroupForm.value.groups.filter(element => element.selected === true).length ? true : false;
      if (this.libraryAssessment) {
        studentsSelected = studentsSelected
          ? true
          : this.assignStudentsForm.value.students.filter(element => element.selected === true).length ? true : false;
      }
    } else {
      studentsSelected = true;
    }
    return !studentsSelected;
  }

  ngOnInit(): void {
    if (this.data?.studentsList) {
      this.data.studentsList.forEach((student, index) => {
        if (student.assessments_count) {
          const translatedText = this.translateService.instant('students.questionSetAccessesBuilder.newAssessment');
          this.confirmReplaceAssessment(student.id, translatedText, student.full_name, index, student.assessment_complete);
        } else {
          this.studentsList.push(student);
        }
      });
    }
    if (this.data?.assessment) {
      this.libraryAssessment = true;
      this.assessment = this.data?.assessment;
      this.loadStudentsList();
      this.loadQuestionSetsList(this.data?.assessment.id);
    } else {
      this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
        this.assessmentsList = assessmentsList.filter(assessment => assessment.archived !== true);
      });
    }

    this.loadGroupsList();
  }

  public loadQuestionSetsList(assessmentId: string): void {
    this.selectedAssessmentId = assessmentId;
    this.assessmentService.getAssessmentQuestionSets(assessmentId).subscribe((newList) => {
      this.questionSetsList = newList.filter(questionSet => questionSet.archived !== true);
      this.generateQuestionSetsForm();
    });
  }

  public onDateInput(type, date): void {
    if (type === 'start_date') {
      this.startDate = date;
    }
    if (type === 'end_date') {
      this.endDate = date;
    }
  }

  public onApplyToAllQuestionSets(value: boolean): void {
    this.applyToAllQuestionSets = value;
    const accessForm = this.assignQuestionSetForm.get('access') as FormArray;
    accessForm.controls.forEach((access, i) => {
      access.setValue({
        question_set: access.value.question_set,
        selected: access.value.selected,
        start_date: value || i === 0 ? this.startDate : null,
        end_date: value || i === 0 ? this.endDate : null
      });
    });
  }

  public submitCreateQuestionSetAccesses(): void {
    let studentsArray: number[] = [];
    if (this.studentsList.length) {
      if (this.libraryAssessment) {
        this.studentControls.forEach(control => {
          if (control.get('selected').value) {
            studentsArray.push(control.get('student').value.id);
          }
        });
      } else {
        this.studentsList.forEach(student => {
          studentsArray.push(student.id);
        });
      }
    }

    for (const element of this.assignGroupForm.value.groups) {
      if (element.selected) {
        studentsArray = studentsArray.concat(element.group.students);
      }
    }

    const accessesArray = new Array<{
      question_set: number;
      start_date: string;
      end_date: string;
    }>();

    for (const element of this.assignQuestionSetForm.value.access) {
      if (element.selected) {
        if (element.start_date && element.end_date) {
          accessesArray.push({
            question_set: element.question_set.id,
            start_date: this.utilitiesService.dateFormatter(element.start_date),
            end_date: this.utilitiesService.dateFormatter(element.end_date)
          });
        } else {
          this.alertService.error(this.translateService.instant('students.questionSetAccessesBuilder.notifier'));
          return;
        }
      }
    }

    const BatchQuestionSetAccessesData: BatchQuestionSetAccesses = {
      students: studentsArray,
      accesses: accessesArray
    };

    this.userService.assignQuestionSetsAccesses(BatchQuestionSetAccessesData, this.selectedAssessmentId).subscribe(
      result => {
        this.alertService.success(this.translateService.instant('students.questionSetAccessesBuilder.accessesSet'));
      },
      error => {
        this.alertService.error(this.translateService.instant('students.questionSetAccessesBuilder.errorOnSubmit'));
      }
    );
  }

  // Selected questionSets needs validations, unselected ones don't
  public selectQuestionSet(questionSet, selected): void {
    if (selected) {
      questionSet.get('start_date').setValidators([Validators.required]);
      questionSet.get('start_date').updateValueAndValidity();

      questionSet.get('end_date').setValidators([Validators.required]);
      questionSet.get('end_date').updateValueAndValidity();
    } else {
      questionSet.get('start_date').clearValidators();
      questionSet.get('start_date').updateValueAndValidity();

      questionSet.get('end_date').clearValidators();
      questionSet.get('end_date').updateValueAndValidity();
    }
  }

  public uniqueAssessmentCheck(student, selected): void {
    const studentValue = student.get('student').value;
    if (selected && studentValue.assessments_count) {
      this.confirmReplaceAssessment(
        studentValue.id, this.assessment.title, studentValue.full_name, student, studentValue.assessment_complete
      );
    }
  }

  private generateQuestionSetsForm(): void {
    const accessForm = this.assignQuestionSetForm.get('access') as FormArray;
    accessForm.clear();

    this.questionSetsList.forEach((questionSet: QuestionSetTableData) => {
      if (questionSet.questions_count === 0) {
        return;
      }
      const questionSetAccess = this.formBuilder.group({
        question_set: new FormControl(questionSet),
        selected: new FormControl(true),
        start_date: this.applyToAllQuestionSets ? this.startDate : new FormControl(null, Validators.required),
        end_date: this.applyToAllQuestionSets ? this.endDate : new FormControl(null, Validators.required)
      });
      accessForm.push(questionSetAccess);
    });
  }

  private generateGroupsForm(): void {
    const groupForm = this.assignGroupForm.get('groups') as FormArray;
    groupForm.clear();

    let selectedGroups = false;
    if (this.data?.groupsList && this.data?.groupsList.length) {
      selectedGroups = true;
    }

    this.groupsList.forEach((group: Group, i: number) => {
      const groupAccess = this.formBuilder.group({
        group: new FormControl(group),
        selected: new FormControl(
          selectedGroups ? this.data?.groupsList.includes(group.id) : false
        ),
        name: new FormControl(group.name),
      });
      groupForm.push(groupAccess);
    });
  }

  private generateStudentsForm(): void {
    const studentsForm = this.assignStudentsForm.get('students') as FormArray;
    studentsForm.clear();

    this.studentsList.forEach(student => {
      const studentForm = this.formBuilder.group({
        student: new FormControl(student),
        selected: new FormControl(false),
        name: new FormControl(student.name),
      });
      studentsForm.push(studentForm);
    });
  }

  private loadGroupsList(): void {
    this.userService.getGroups().subscribe((groups) => {
      this.groupsList = groups.filter(group => group.students.length);
      this.generateGroupsForm();
    });
  }

  private loadStudentsList(): void {
    this.userService.getStudentsList().subscribe(studentsList => {
      this.studentsList = studentsList.filter(student =>
        student.country_name === this.assessment.country_name &&
        student.language_name === this.assessment.language_name &&
        student.assessments_count === 0
      );
      this.generateStudentsForm();
    });
  }

  // A student should only have one and one assessment
  private confirmReplaceAssessment(
    studentId: number, newAssessment: string, studentName: string, student: any, assessmentIncomplete: boolean
  ): void {
    this.assessmentService.getStudentAssessments(studentId).subscribe(studentAssessments => {
      const confirmDialog = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: this.translateService.instant('students.questionSetAccessesBuilder.studentAssessmentPrompt', {
            studentName
          }),
          content: assessmentIncomplete
            ? this.translateService.instant('students.questionSetAccessesBuilder.studentAssessmentIncompletePrompt', {
                currentAssessment: studentAssessments[0].title
              })
            : this.translateService.instant('students.questionSetAccessesBuilder.replaceAsssessmentAccess', {
                previousAssessment: studentAssessments[0].title,
                newAssessment
              }),
          contentType: 'innerHTML',
          confirmColor: 'warn'
        }
      });

      confirmDialog.afterClosed().subscribe(res => {
        if (!res && this.libraryAssessment) {
          student.get('selected').setValue(false);
        } else if (res && !this.libraryAssessment) {
          this.studentsList.push(this.data?.studentsList[student]);
        }
      });
    });
  }
}
