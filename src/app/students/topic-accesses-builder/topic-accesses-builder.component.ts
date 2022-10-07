import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Assessment } from 'src/app/core/models/assessment.model';
import { BatchTopicAccesses } from 'src/app/core/models/batch-topic-accesses.model';
import { Topic } from 'src/app/core/models/topic.models';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/core/models/group.model';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

interface DialogData {
  studentsList?: any[];
  assessment?: any;
}

@Component({
  selector: 'app-topic-accesses-builder',
  templateUrl: './topic-accesses-builder.component.html',
  styleUrls: ['./topic-accesses-builder.component.scss']
})

export class TopicAccessesBuilderComponent implements OnInit {

  private topicsList: Topic[] = [];
  public groupsList: Group[] = [];
  private selectedAssessmentId: string;
  private applyToAllTopics: boolean;
  public libraryAssessment: boolean;

  public minDate: Date = new Date();
  public studentsList: any[] = [];
  public assessmentsList: Assessment[] = [] ;
  public assessment: Assessment;
  public startDate: Date;
  public endDate: Date;

  public assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  public assignGroupForm: FormGroup = new FormGroup({
    groups: new FormArray([])
  });

  public assignStudentsForm: FormGroup = new FormGroup({
    students: new FormArray([])
  });

  get topicControls(): AbstractControl[] {
    return (this.assignTopicForm.get('access') as FormArray).controls;
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

  ngOnInit(): void {
    if (this.data?.studentsList) {
      this.data.studentsList.forEach((student, index) => {
        if (student.assessments_count) {
          const translatedText = this.translateService.instant('students.topicAccessesBuilder.newAssessment');
          this.confirmReplaceAssessment(student.id, translatedText, student.full_name, index);
        } else {
          this.studentsList.push(student);
        }
      });
    }
    if (this.data?.assessment) {
      this.libraryAssessment = true;
      this.assessment = this.data?.assessment;
      this.loadStudentsList();
      this.loadTopicsList(this.data?.assessment.id);
    } else {
      this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
        this.assessmentsList = assessmentsList.filter(assessment => assessment.archived !== true);
      });
    }

    this.loadGroupsList();
  }

  public loadTopicsList(assessmentId: string): void {
    this.selectedAssessmentId = assessmentId;
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((newList) => {
      this.topicsList = newList.filter(topic => topic.archived !== true);
      this.generateTopicsForm();
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
      this.studentsList = studentsList;
      this.generateStudentsForm();
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

  public onApplyToAllTopics(value: boolean): void {
    this.applyToAllTopics = value;
    const accessForm = this.assignTopicForm.get('access') as FormArray;
    accessForm.controls.forEach((access, i) => {
      access.setValue({
        topic: access.value.topic,
        selected: access.value.selected,
        start_date: value || i === 0 ? this.startDate : null,
        end_date: value || i === 0 ? this.endDate : null
      });
    });
  }

  private generateTopicsForm(): void {
    const accessForm = this.assignTopicForm.get('access') as FormArray;
    accessForm.clear();

    this.topicsList.forEach((topic: Topic, i: number) => {
      const topicAccess = this.formBuilder.group({
        topic: new FormControl(topic),
        selected: new FormControl(true),
        start_date: this.applyToAllTopics ? this.startDate : new FormControl(null, Validators.required),
        end_date: this.applyToAllTopics ? this.endDate : new FormControl(null, Validators.required)
      });
      accessForm.push(topicAccess);
    });
  }

  private generateGroupsForm(): void {
    const groupForm = this.assignGroupForm.get('groups') as FormArray;
    groupForm.clear();

    this.groupsList.forEach((group: Group, i: number) => {
      const groupAccess = this.formBuilder.group({
        group: new FormControl(group),
        selected: new FormControl(false),
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

  public submitCreateTopicAccesses(): void {
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
      topic: number,
      start_date: string,
      end_date: string
    }>();

    for (const element of this.assignTopicForm.value.access) {
      if (element.selected) {
        if (element.start_date && element.end_date) {
          accessesArray.push({
            topic: element.topic.id,
            start_date: this.utilitiesService.dateFormatter(element.start_date),
            end_date: this.utilitiesService.dateFormatter(element.end_date)
          });
        } else {
          this.alertService.error(this.translateService.instant('students.topicAccessesBuilder.notifier'));
          return;
        }
      }
    }

    const batchTopicAccessesData: BatchTopicAccesses = {
      students: studentsArray,
      accesses: accessesArray
    };

    this.userService.assignTopicsAccesses(batchTopicAccessesData, this.selectedAssessmentId).subscribe(
      result => {
        this.alertService.success(this.translateService.instant('students.topicAccessesBuilder.accessesSet'));
      },
      error => {
        this.alertService.error(this.translateService.instant('students.topicAccessesBuilder.errorOnSubmit'));
      }
    );
  }

  // Selected topics needs validations, unselected ones don't
  public selectTopic(topic, selected): void {
    if (selected) {
      topic.get('start_date').setValidators([Validators.required]);
      topic.get('start_date').updateValueAndValidity();

      topic.get('end_date').setValidators([Validators.required]);
      topic.get('end_date').updateValueAndValidity();
    } else {
      topic.get('start_date').clearValidators();
      topic.get('start_date').updateValueAndValidity();

      topic.get('end_date').clearValidators();
      topic.get('end_date').updateValueAndValidity();
    }
  }

  public uniqueAssessmentCheck(student, selected): void {
    const studentValue = student.get('student').value;
    if (selected && studentValue.assessments_count) {
      this.confirmReplaceAssessment(studentValue.id, this.assessment.title, studentValue.full_name, student);
    }
  }
  // A student should only have one and one assessment
  private confirmReplaceAssessment(studentId: number, newAssessment: string, studentName: string, student: any): void {
    this.assessmentService.getStudentAssessments(studentId).subscribe(studentAssessments => {
      const confirmDialog = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: this.translateService.instant('students.topicAccessesBuilder.studentAssessmentPrompt', {
            studentName
          }),
          content: this.translateService.instant('students.topicAccessesBuilder.replaceAsssessmentAccess', {
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
