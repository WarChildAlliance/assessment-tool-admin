import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BatchQuestionSetAccesses } from 'src/app/core/models/batch-question-set-accesses.model';
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
  selector: 'app-question-set-access-modal',
  templateUrl: './question-set-access-modal.component.html',
  styleUrls: ['./question-set-access-modal.component.scss']
})
export class QuestionSetAccessModalComponent implements OnInit {

  public minDate: Date = new Date();
  public assessment: any;
  public studentId: any;
  public assessmentTitle: string;
  public assessmentId: string;
  public deletedQuestionSet = false;

  public assignQuestionSetForm: FormGroup = new FormGroup({
    access: new FormArray([]),
  });

  private startDate: Date;
  private endDate: Date;
  private applyToAllQuestionSets: boolean;

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
    return (this.assignQuestionSetForm.get('access') as FormArray).controls;
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

  public onApplyToAllQuestionSets(value: boolean): void {
    this.applyToAllQuestionSets = value;
    const accessForm = this.assignQuestionSetForm.get('access') as FormArray;
    accessForm.controls.forEach((access, i) => {
      access.setValue({
        question_set: access.value.question_set,
        start_date: value || i === 0 ? this.startDate : null,
        end_date: value || i === 0 ? this.endDate : null
      });
    });
    this.assignQuestionSetForm.markAsDirty();
  }

  public submitCreateQuestionSetAccesses(): void {
    const studentsArray: number[] = [this.studentId];

    const accessesArray: any[] = [];

    for (const element of this.assignQuestionSetForm.value.access) {
      if (element.start_date && element.end_date) {
        accessesArray.push({
          question_set: element.question_set.question_set_id,
          start_date: this.utilitiesService.dateFormatter(element.start_date),
          end_date: this.utilitiesService.dateFormatter(element.end_date)
        });
      } else {
        this.alertService.error(this.translateService.instant('students.questionSetAccessesEdit.missingDates'));
        return;
      }
    }

    const BatchQuestionSetAccessesData: BatchQuestionSetAccesses = {
      students: studentsArray,
      accesses: accessesArray
    };

    this.userService.assignQuestionSetsAccesses(BatchQuestionSetAccessesData, this.assessmentId).subscribe(
      result => {
        this.alertService.success(this.translateService.instant('students.questionSetAccessesEdit.questionSetsUpdated'));
      },
      error => {
        this.alertService.error(this.translateService.instant('students.questionSetAccessesEdit.errorOnEdit'));
      }
    );
  }

  public removeQuestionSetAccess(questionSet): void {
    const questionSetTitle = questionSet.get('question_set').value.question_set_name;
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('students.questionSetAccessesEdit.removeQuestionSetAccess'),
        content: this.translateService.instant('students.questionSetAccessesEdit.removeQuestionSetAccessPrompt', { questionSetTitle }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });
    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteQuestionSetAccess(questionSet);
      }
    });
  }

  private deleteQuestionSetAccess(questionSet): void {
    const questionSetAccessId = questionSet.get('question_set').value.question_set_access_id;

    this.userService.removeQuestionSetAccess(this.assessmentId, questionSetAccessId).subscribe(
      result => {
        this.alertService.success(this.translateService.instant('students.questionSetAccessesEdit.accessEdited'));

        (this.assignQuestionSetForm.controls.access as FormArray).removeAt(
          this.assignQuestionSetForm.value.access.findIndex(elem => elem.question_set === questionSet.controls.question_set.value)
        );

        this.deletedQuestionSet = true;
      },
      error => {
        this.alertService.error(this.translateService.instant('students.questionSetAccessesEdit.errorOnDeletion'));
      }
    );
  }

  private generateForm(): void {
    const accessForm = this.assignQuestionSetForm.get('access') as FormArray;

    this.assessment.forEach((elem) => {
      this.assessmentTitle = elem.title;
      this.assessmentId = elem.id;

      elem.question_set_access.forEach(questionSet => {
      // Format initials dates
      const startDate = new Date (questionSet.start_date);
      startDate.setDate(startDate.getDate() + 1);

      const endDate = new Date (questionSet.end_date);
      endDate.setDate(endDate.getDate() + 1);

      const questionSetAccess = this.formBuilder.group({
        question_set: new FormControl(questionSet),
        start_date: this.applyToAllQuestionSets ? this.startDate : new FormControl(startDate, Validators.required),
        end_date: this.applyToAllQuestionSets ? this.endDate : new FormControl(endDate, Validators.required)
      });

      accessForm.push(questionSetAccess);
      });
    });
  }
}
