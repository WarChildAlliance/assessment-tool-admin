import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  minDate: Date;
  @Input() studentsList: any[];

  assessmentsList: Assessment[] = [];
  topicsList: Topic[] = [];
  selectedAssessmentId: string;

  assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  @Output() closeTopicsDialogEvent = new EventEmitter<void>();

  constructor(private assessmentService: AssessmentService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private alertService: AlertService) {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear, currentMonth, currentDay);
  }

  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsList = assessmentsList;
    });
  }

  loadTopicsList(assessmentId: string): void {
    this.selectedAssessmentId = assessmentId;
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((newList) => {
      this.topicsList = newList;
      this.generateForm();
    });
  }

  generateForm(): void {
    const accessForm = this.assignTopicForm.get('access') as FormArray;
    accessForm.clear();

    this.topicsList.forEach((topic: Topic) => {
      const topicAccess = this.formBuilder.group({
        topic: new FormControl(topic),
        selected: new FormControl(true),
        start_date: new FormControl(null),
        end_date: new FormControl(null)
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
        this.closeTopicsDialogEvent.emit();
      },
      error => {
        console.log('ERROR', error);
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
