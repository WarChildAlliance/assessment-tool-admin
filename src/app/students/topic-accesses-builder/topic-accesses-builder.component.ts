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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/core/models/group.model';

interface DialogData {
  studentsList?: any[];
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

  public minDate: Date = new Date();
  public studentsList: any[];
  public assessmentsList: Assessment[] = [];
  public startDate: Date;
  public endDate: Date;

  public assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  assignGroupForm: FormGroup = new FormGroup({
    groups: new FormArray([])
  });

  get topicControls(): AbstractControl[] {
    return (this.assignTopicForm.get('access') as FormArray).controls;
  }

  get groupControls(): AbstractControl[] {
    return (this.assignGroupForm.get('groups') as FormArray).controls;
  }

  get disabledAssign(): boolean {
    let studentsSelected = false;
    if (this.data.studentsList && !this.data.studentsList.length) {
      studentsSelected = this.assignGroupForm.value.groups.filter(element => element.selected === true).length ? true : false;
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
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.data?.studentsList) { this.studentsList = this.data.studentsList; }
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsList = assessmentsList.filter(assessment => assessment.archived !== true);
    });

    this.loadGroupsList();
  }

  public loadTopicsList(assessmentId: string): void {
    this.selectedAssessmentId = assessmentId;
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((newList) => {
      this.topicsList = newList.filter(topic => topic.archived !== true);
      this.generateTopicsForm();
    });
  }

  loadGroupsList(): void {
    this.userService.getGroups().subscribe((groups) => {
      this.groupsList = groups.filter(group => group.students.length);
      this.generateGroupsForm();
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

  public generateTopicsForm(): void {
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

  public generateGroupsForm(): void {
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

  public submitCreateTopicAccesses(): void {
    let studentsArray: number[] = [];
    if (this.studentsList.length) {
      this.studentsList.forEach(student => {
        studentsArray.push(student.id);
      });
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
}
