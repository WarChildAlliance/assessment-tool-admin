import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BatchTopicAccesses } from 'src/app/core/models/batch-topic-accesses.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topic-access-edit',
  templateUrl: './topic-access-edit.component.html',
  styleUrls: ['./topic-access-edit.component.scss']
})
export class TopicAccessEditComponent implements OnInit {
  minDate: Date = new Date();

  @Input() assessment: any;
  @Input() studentId: any;

  private startDate;
  private endDate;
  public assessmentTitle;
  public assessmentId;

  private setDate: boolean;
  public deletedTopic = false;

  assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  get controls(): AbstractControl[] {
    return (this.assignTopicForm.get('access') as FormArray).controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private alertService: AlertService,
    private userService: UserService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.assessment) {
      this.generateForm();
    }
  }

  generateForm(): void {
    const accessForm = this.assignTopicForm.get('access') as FormArray;

    this.assessment.forEach((elem) => {
      this.assessmentTitle = elem.title;
      this.assessmentId = elem.id;

      elem.topic_access.forEach(topic => {
      // Format initials dates
      const startDate = new Date (topic.start_date);
      startDate.setDate(startDate.getDate() + 1);

      const endDate = new Date (topic.end_date);
      endDate.setDate(endDate.getDate() + 1);

      const topicAccess = this.formBuilder.group({
        topic: new FormControl(topic),
        start_date: this.setDate ? this.startDate : new FormControl(startDate, Validators.required),
        end_date: this.setDate ? this.endDate : new FormControl(endDate, Validators.required)
      });

      accessForm.push(topicAccess);
      });
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
        start_date: event || i === 0 ? this.startDate : null,
        end_date: event || i === 0 ? this.endDate : null
      });
    });
  }

  submitCreateTopicAccesses(): void {
    const studentsArray: number[] = [this.studentId];

    const accessesArray: any[] = [];

    for (const element of this.assignTopicForm.value.access) {
      if (element.start_date && element.end_date) {
        accessesArray.push({
          topic: element.topic.topic_id,
          start_date: this.utilitiesService.dateFormatter(element.start_date),
          end_date: this.utilitiesService.dateFormatter(element.end_date)
        });
      } else {
        this.alertService.error(this.translateService.instant('students.topicAccessesEdit.missingDates'));
        return;
      }
    }

    const batchTopicAccessesData: BatchTopicAccesses = {
      students: studentsArray,
      accesses: accessesArray
    };

    this.userService.assignTopicsAccesses(batchTopicAccessesData, this.assessmentId).subscribe(
      result => {
        this.alertService.success(this.translateService.instant('students.topicAccessesEdit.topicsUpdated'));
      },
      error => {
        this.alertService.error(this.translateService.instant('students.topicAccessesEdit.errorOnEdit'));
      }
    );
  }

  delete(topic): void {
    const topicAccessId = topic.get('topic').value.topic_access_id;

    this.userService.removeTopicAccess(this.assessmentId, topicAccessId).subscribe(
      result => {
        this.alertService.success(this.translateService.instant('students.topicAccessesEdit.accessEdited'));

        (this.assignTopicForm.controls.access as FormArray).removeAt(
          this.assignTopicForm.value.access.findIndex(elem => elem.topic === topic.controls.topic.value)
        );

        this.deletedTopic = true;
      },
      error => {
        this.alertService.error(this.translateService.instant('students.topicAccessesEdit.errorOnDeletion'));
      }
    );
  }
}
