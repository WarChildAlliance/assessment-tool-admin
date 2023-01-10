import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionSet } from 'src/app/core/models/question-set.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { QuestionSetAccessesBuilderComponent } from 'src/app/shared/question-set-accesses-builder/question-set-accesses-builder.component';
import { environment } from 'src/environments/environment';
import { AssessmentFormDialogComponent } from '../assessment-form-dialog/assessment-form-dialog.component';
import { QuestionSetFormDialogComponent } from '../question-set-form-dialog/question-set-form-dialog.component';

@Component({
  selector: 'app-assessment-summary',
  templateUrl: './assessment-summary.component.html',
  styleUrls: ['./assessment-summary.component.scss']
})
export class AssessmentSummaryComponent implements OnInit {

  @Input() assessment: any;
  @Input() canEdit: boolean;
  @Input() library: boolean;

  @Output() reloadAssessments = new EventEmitter<boolean>();

  public assessmentId: string;

  public edit: boolean;
  public smallScreen: boolean;
  public leftScrollEnabled = false;
  public rightScrollEnabled = true;
  public reorder = false;
  public changedOrder = false;
  public questionSetToOrder: QuestionSet[] = [];
  public loading = false;
  public loadingQS = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private assessmentService: AssessmentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
  }

  public openQuestionSetFormDialog(assessment: any): void {
    this.assessmentId = assessment.id;

    const questionSetFormDialog = this.dialog.open(QuestionSetFormDialogComponent, {
      data: {
        assessmentId: this.assessmentId,
        order: this.assessment.question_sets.length + 1,
        subject: this.assessment.subject.toUpperCase(),
        grade: this.assessment.grade,
        topicId: this.assessment.topic?.id ?? null,
      }
    });

    questionSetFormDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getAssessmentDetails(this.assessmentId);
      }
    });
  }

  public deleteAssessment(assessmentId: string, assessmentTitle: string): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('general.delete', {
          type: this.translateService.instant('general.assessment').toLocaleLowerCase()
        }),
        content: this.translateService.instant('general.simpleDeletePrompt', {
          type: this.translateService.instant('general.assessment').toLocaleLowerCase(),
          name: assessmentTitle
        }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteAssessment(assessmentId).subscribe(() => {
          this.alertService.success(this.translateService.instant('general.deleteSuccess', {
            type:  this.translateService.instant('general.assessment')
          }));
          this.reloadAssessments.emit(true);
        });
      }
    });
  }

  public deleteQuestionSet(event: MouseEvent, assessmentId: string, questionSetId: string, questionSetTitle: string): void {
    event.stopPropagation();

    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('general.delete', {
          type: this.translateService.instant('general.questionSet').toLocaleLowerCase()
        }),
        content: this.translateService.instant('general.simpleDeletePrompt', {
          type: this.translateService.instant('general.questionSet').toLocaleLowerCase(),
          name: questionSetTitle
        }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteQuestionSet(assessmentId, questionSetId).subscribe(() => {
          this.alertService.success(this.translateService.instant('general.deleteSuccess', {
            type:  this.translateService.instant('general.questionSet')
          }));
          this.getAssessmentDetails(assessmentId);
        });
      }
    });
  }

  public archiveAssessment(assessmentId, archived): void {
    const formData: FormData = new FormData();
    formData.append('archived', archived);

    this.assessmentService.editAssessment(assessmentId, formData).subscribe(res => {
      this.alertService.success(this.translateService.instant('general.editSuccess', {
        type: this.translateService.instant('general.assessment')
      }));
      this.reloadAssessments.emit(true);
    });
  }

  public editAssessment(assessment, clone?: boolean): void {
    this.loading = true;
    this.edit = clone ? false : true;
    this.assessment = assessment;

    const createAssessmentDialog = this.dialog.open(AssessmentFormDialogComponent, {
      data: {
        edit: this.edit,
        clone,
        assessment: this.assessment
      }
    });

    createAssessmentDialog.afterClosed().subscribe((value) => {
      if (value) {
        if (value.archived !== assessment.archived) {
          this.reloadAssessments.emit(true);
        }
        this.loading = false;
        this.getAssessmentDetails(this.assessment.id);
      }
    });
  }

  public goToQuestionSetDetails(assessmentId, questionSetId): void {
    this.router.navigate([`${assessmentId}/question_sets/${questionSetId}`], { relativeTo: this.route });
  }

  public getSource(path: string): string {
    return `${environment.API_URL}${path}`;
  }

  public getMediaSource(path: string): string {
    return `${environment.API_URL}/media/${path}`;
  }

  public downloadPDF(assessmentId: string): void {
    // Skip confirmation dialog for private assessments
    if (this.assessment.private) {
      this.assessmentService.downloadPDF(assessmentId);
      return;
    }
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('assessmentBuilder.assessmentSummary.fileDownloadNoticeTitle'),
        content: this.translateService.instant('assessmentBuilder.assessmentSummary.fileDownloadNotice'),
        contentType: 'innerHTML',
        confirmColor: 'accent'
      }
    });
    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.downloadPDF(assessmentId);
      }
    });
  }

  // Start and save reorder question sets by drag&drop
  public reorderQuestionSets(save: boolean, assessmentId: string): void {
    if (!save) {
      this.reorder = true;
      // Deep copy to avoid modifying both arrays
      this.questionSetToOrder = [...this.assessment.question_sets];
    } else {
      if (this.changedOrder) {
        const data = {
          question_sets: [],
          assessment_id: assessmentId
        };
        this.assessment.question_sets.forEach(questionSet => {
          data.question_sets.push(questionSet.id);
        });

        this.assessmentService.reorderQuestionSets(assessmentId, data).subscribe(() => {
          this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentSummary.orderChanged'));
        });
      }
      this.reorder = false;
      this.changedOrder = false;
    }
  }

  // To reorder the question sets in the question set list after drop
  public dropQuestionSet(event: CdkDragDrop<object[]>): void {
    moveItemInArray(this.assessment.question_sets, event.previousIndex, event.currentIndex);
    this.changedOrder = true;
  }

  // Go back to previous order
  public cancelReorder(): void {
    this.assessment.question_sets = this.questionSetToOrder;
    this.reorder = false;
  }

  public openAssignQuestionSetDialog(assessment): void {
    this.dialog.open(QuestionSetAccessesBuilderComponent, {
      data: {
        assessment
      }
    });
  }

  private getAssessmentDetails(assessmentId: string): void {
    this.loadingQS = true;
    this.assessmentService.getAssessmentQuestionSets(assessmentId).subscribe(() => {
      this.assessmentService.getAssessmentDetails(assessmentId).subscribe(assessmentDetails => {
        this.assessment = assessmentDetails;
        this.loadingQS = false;
      });
    });
  }
}
