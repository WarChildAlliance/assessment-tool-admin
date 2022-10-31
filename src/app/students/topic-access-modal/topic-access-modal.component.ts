import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BatchTopicAccesses } from 'src/app/core/models/batch-topic-accesses.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';


interface DialogData {
  assessment?: any;
  studentId?: any;
}
@Component({
  selector: 'app-topic-access-modal',
  templateUrl: './topic-access-modal.component.html',
  styleUrls: ['./topic-access-modal.component.scss']
})
export class TopicAccessModalComponent implements OnInit {

  public minDate: Date = new Date();
  public assessment: any;
  public studentId: any;
  public assessmentTitle: string;
  public assessmentId: string;
  public deletedTopic = false;

  public assignTopicForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  private startDate: Date;
  private endDate: Date;
  private applyToAllTopics: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private alertService: AlertService,
    private userService: UserService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) { }


  get controls(): AbstractControl[] {
    return (this.assignTopicForm.get('access') as FormArray).controls;
  }

  ngOnInit(): void {
    if (this.data?.assessment) { this.assessment = this.data.assessment; }
    if (this.data?.studentId) { this.studentId = this.data.studentId; }
    if (this.assessment) {
      this.generateForm();
    }
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
        start_date: value || i === 0 ? this.startDate : null,
        end_date: value || i === 0 ? this.endDate : null
      });
    });
  }

  public submitCreateTopicAccesses(): void {
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

  public removeTopicAccess(topic): void {
    const topicTitle = topic.get('topic').value.topic_name;
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('students.topicAccessesEdit.removeTopicAccess'),
        content: this.translateService.instant('students.topicAccessesEdit.removeTopicAccessPrompt', { topicTitle }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });
    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteTopicAccess(topic);
      }
    });
  }

  private deleteTopicAccess(topic): void {
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

  private generateForm(): void {
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
        start_date: this.applyToAllTopics ? this.startDate : new FormControl(startDate, Validators.required),
        end_date: this.applyToAllTopics ? this.endDate : new FormControl(endDate, Validators.required)
      });

      accessForm.push(topicAccess);
      });
    });
  }
}
