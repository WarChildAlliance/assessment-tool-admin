import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Assessment } from 'src/app/core/models/assessment.model';
import { BatchTopicAccesses } from 'src/app/core/models/batch-topic-accesses.model';
import { Topic } from 'src/app/core/models/topic.models';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-topic-accesses-builder',
  templateUrl: './topic-accesses-builder.component.html',
  styleUrls: ['./topic-accesses-builder.component.scss']
})

export class TopicAccessesBuilderComponent implements OnInit {

  minDate: Date = new Date();

  @Input() studentsList: any[];

  assessmentsList: Assessment[] = [];
  topicsList: Topic[] = [];
  selectedAssessmentId: string;

  public startDate;
  public endDate;

  private setDate: boolean;

  assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  constructor(private assessmentService: AssessmentService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsList = assessmentsList.filter(assessment => assessment.archived !== true);
    });
  }

  loadTopicsList(assessmentId: string): void {
    this.selectedAssessmentId = assessmentId;
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((newList) => {
      this.topicsList = newList.filter(topic => topic.archived !== true);
      this.generateForm();
    });
  }

  onDate(date, event): void {
    if (date === 'start_date') {
      this.startDate = event;
    }
    if (date === 'end_date') {
      this.endDate = event;
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

  generateForm(): void {
    const accessForm = this.assignTopicForm.get('access') as FormArray;
    accessForm.clear();

    this.topicsList.forEach((topic: Topic, i: number) => {
      const topicAccess = this.formBuilder.group({
        topic: new FormControl(topic),
        selected: new FormControl(true),
        start_date: this.setDate ? this.startDate : new FormControl(null),
        end_date: this.setDate ? this.endDate : new FormControl(null)
      });
      accessForm.push(topicAccess);
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
            start_date: this.dateFormatter(element.start_date),
            end_date: this.dateFormatter(element.end_date)
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

  getControls(): AbstractControl[] {
    return (this.assignTopicForm.get('access') as FormArray).controls;
  }

  // Move this function to utilities.service if it can be used anywhere else
  dateFormatter(date: Date): string {
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    const year = date.getFullYear().toString();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }
}
