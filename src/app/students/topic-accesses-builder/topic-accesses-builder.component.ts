import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Assessment } from 'src/app/core/models/assessment.model';
import { Topic } from 'src/app/core/models/topic.models';
import { User } from 'src/app/core/models/user.model';
import { BatchTopicAccesses } from 'src/app/core/models/batch-topic-accesses.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-topic-accesses-builder',
  templateUrl: './topic-accesses-builder.component.html',
  styleUrls: ['./topic-accesses-builder.component.scss']
})
export class TopicAccessesBuilderComponent implements OnInit {

  @Input() studentsList: User[];

  assessmentsList: Assessment[] = [];
  topicsList: Topic[] = [];

  assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  @Output() closeTopicsDialogEvent = new EventEmitter<void>();

  constructor(private assessmentService: AssessmentService, private formBuilder: FormBuilder, private alertService: AlertService) { }

  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      const filteredAssessment = assessmentsList.filter((assessment) => (assessment.country === this.studentsList[0].country && assessment.language === this.studentsList[0].language));
      this.assessmentsList = filteredAssessment;
    });
  }

  loadTopicsList(assessmentId: string): void {
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((newList) => {
      this.topicsList = newList;
      this.generateForm();
    });
  }

  generateForm() {
    const accessForm = this.assignTopicForm.get('access') as FormArray;

    this.topicsList.forEach((topic: Topic) => {
      const topicAccess = this.formBuilder.group({
        topic: new FormControl(topic),
        selected: new FormControl(true),
        start_date: new FormControl(null),
        end_date: new FormControl(null)
      })
      accessForm.push(topicAccess);
    });
  }

  submitCreateTopicAccesses() {

    let studentsArray = new Array<{ student_id: number }>();
    this.studentsList.forEach(student => {
      studentsArray.push({ student_id: student.id });
    });

    let accessesArray = new Array<{
      topic_id: number,
      start_date: Date,
      end_date: Date
    }>();

    for (let element of this.assignTopicForm.value.access) {
      if (element.selected) {
        if (element.start_date && element.end_date) {
          accessesArray.push({
            topic_id: element.topic.id,
            start_date: element.start_date,
            end_date: element.end_date
          });
        } else {
          this.alertService.error('You need to set a start date and an end date for each selected topic');
          return;
        }
      }
    }

    let batchTopicAccessesData: BatchTopicAccesses = {
      students: studentsArray,
      accesses: accessesArray
    }

    console.log("FINAL BIG BATCH: ", batchTopicAccessesData);

    // TODO POST request here

    this.alertService.success('The new topic accesses have been successfully set !');

    this.closeTopicsDialogEvent.emit();
  }

  getControls() {
    return (this.assignTopicForm.get('access') as FormArray).controls;
  }
}
