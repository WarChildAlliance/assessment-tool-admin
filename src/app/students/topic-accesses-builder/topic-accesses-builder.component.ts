import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Assessment } from 'src/app/core/models/assessment.model';
import { BatchTopicAccesses } from 'src/app/core/models/batch-topic-accesses.model';
import { Topic } from 'src/app/core/models/topic.models';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  private selectedAssessmentId: string;
  private setDate: boolean;

  public minDate: Date = new Date();
  public studentsList: any[];
  public assessmentsList: Assessment[] = [];
  public startDate: Date;
  public endDate: Date;

  public assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  get controls(): AbstractControl[] {
    return (this.assignTopicForm.get('access') as FormArray).controls;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private assessmentService: AssessmentService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    if (this.data?.studentsList) { this.studentsList = this.data.studentsList; }
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsList = assessmentsList.filter(assessment => assessment.archived !== true);
    });
  }

  private generateForm(): void {
    const accessForm = this.assignTopicForm.get('access') as FormArray;
    accessForm.clear();

    this.topicsList.forEach((topic: Topic, i: number) => {
      const topicAccess = this.formBuilder.group({
        topic: new FormControl(topic),
        selected: new FormControl(true),
        start_date: this.setDate ? this.startDate : new FormControl(null, Validators.required),
        end_date: this.setDate ? this.endDate : new FormControl(null, Validators.required)
      });
      accessForm.push(topicAccess);
    });
  }

  loadTopicsList(assessmentId: string): void {
    this.selectedAssessmentId = assessmentId;
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((newList) => {
      this.topicsList = newList.filter(topic => topic.archived !== true);
      this.generateForm();
    });
  }

  onDate(type, date): void {
    if (type === 'start_date') {
      this.startDate = date;
    }
    if (type === 'end_date') {
      this.endDate = date;
    }
  }

  setAll(event): void {
    this.setDate = event;
    const accessForm = this.assignTopicForm.get('access') as FormArray;
    accessForm.controls.forEach((access, i) => {
      access.setValue({
        topic: access.value.topic,
        selected: access.value.selected,
        start_date: event || i === 0 ? this.startDate : null,
        end_date: event || i === 0 ? this.endDate : null
      });
    });
  }

  submitCreateTopicAccesses(): void {
    const studentsArray: number[] = [];
    this.studentsList.forEach(student => {
      studentsArray.push(student.id);
    });

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
          this.alertService.error('You need to set a start date and an end date for each selected topic');
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
        this.alertService.success('The new topic accesses have been successfully set !');
      },
      error => {
        this.alertService.error('There was an error during the submission of the topic accesses');
      }
    );
  }

  // Selected topics needs validations, unselected ones don't
  selectTopic(topic, selected): void {
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
