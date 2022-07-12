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
import { Topic } from 'src/app/core/models/topic.models';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { environment } from 'src/environments/environment';
import { AssessmentFormDialogComponent } from '../assessment-form-dialog/assessment-form-dialog.component';
import { TopicFormDialogComponent } from '../topic-form-dialog/topic-form-dialog.component';

@Component({
  selector: 'app-assessment-summary',
  templateUrl: './assessment-summary.component.html',
  styleUrls: ['./assessment-summary.component.scss']
})
export class AssessmentSummaryComponent implements OnInit {

  @Input() assessment: any;
  @Input() canEdit: boolean;

  @Output() reloadAssessments = new EventEmitter<boolean>();

  public assessmentId: string;

  public edit: boolean;
  public smallScreen: boolean;
  public leftScrollEnabled = false;
  public rightScrollEnabled = true;
  public reorder = false;
  public changedOrder = false;
  public topicToOrder: Topic[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private assessmentService: AssessmentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.orderTopics();
  }

  private orderTopics(): void {
    // To order and display unarchived topic cards first
    this.assessment.topics.sort((a, b) => {
      if (a.archived > b.archived) {
        return 1;
      }
      if (a.archived < b.archived) {
        return -1;
      }

      return 0;
    });
  }

  private getAssessmentDetails(assessmentId: string): void {
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe(() => {
      this.assessmentService.getAssessmentDetails(assessmentId).subscribe(assessmentDetails => {
        this.assessment = assessmentDetails;
        this.orderTopics();
      });
    });
  }

  public openTopicFormDialog(assessment: any): void {
    this.assessmentId = assessment.id;

    const topicFormDialog = this.dialog.open(TopicFormDialogComponent, {
      data: {
        assessmentId: this.assessmentId,
        order: this.assessment.topics.length + 1
      }
    });

    topicFormDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getAssessmentDetails(this.assessmentId);
      }
    });
  }

  public deleteAssessment(assessmentId: string, assessmentTitle: string): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('assessmentBuilder.assessmentSummary.deleteAssessment'),
        content: this.translateService.instant('assessmentBuilder.assessmentSummary.deleteAssessmentPrompt', { assessmentTitle }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteAssessment(assessmentId).subscribe(() => {
          this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentSummary.deleteAssessmentSuccess'));
          this.reloadAssessments.emit(true);
        });
      }
    });
  }

  public deleteTopic(event: MouseEvent, assessmentId: string, topicId: string, topicTitle: string): void {
    event.stopPropagation();

    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('assessmentBuilder.assessmentSummary.deleteTopic'),
        content: this.translateService.instant('assessmentBuilder.assessmentSummary.deleteTopicPrompt', { topicTitle }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.assessmentService.deleteTopic(assessmentId, topicId).subscribe(() => {
          this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentSummary.topicDetailSuccess'));
          this.getAssessmentDetails(assessmentId);
        });
      }
    });
  }

  public archiveTopic(event: MouseEvent, assessmentId, topicId, archived): void {
    event.stopPropagation();

    const formData: FormData = new FormData();
    formData.append('archived', archived);

    this.assessmentService.editTopic(assessmentId.toString(), topicId, formData).subscribe(() => {
      this.alertService.success(this.translateService.instant('assessmentBuilder.topicEditSuccess'));
      this.getAssessmentDetails(assessmentId);
    });
  }

  public archiveAssessment(assessmentId, archived): void {
    const formData: FormData = new FormData();
    formData.append('archived', archived);

    this.assessmentService.editAssessment(assessmentId, formData).subscribe(res => {
      this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentEditSuccess'));
      this.reloadAssessments.emit(true);
    });
  }

  public editAssessment(assessment): void {
    this.edit = true;
    this.assessment = assessment;

    const createAssessmentDialog = this.dialog.open(AssessmentFormDialogComponent, {
      data: {
        edit: this.edit,
        assessment: this.assessment
      }
    });

    createAssessmentDialog.afterClosed().subscribe((value) => {
      if (value) {
        if (value.archived !== assessment.archived) {
          this.reloadAssessments.emit(true);
        }
        this.getAssessmentDetails(this.assessment.id);
      }
    });
  }

  public goToTopicDetails(assessmentId, topicId): void {
    this.router.navigate([`${assessmentId}/topic/${topicId}`], { relativeTo: this.route });
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

  // Start and save reorder topics by drag&drop
  public reorderTopics(save: boolean, assessmentId: string): void {
    if (!save) {
      this.reorder = true;
      // Deep copy to avoid modifying both arrays
      this.topicToOrder = [...this.assessment.topics];
    } else {
      if (this.changedOrder) {
        const data = {
          topics: [],
          assessment_id: assessmentId
        };

        this.assessment.topics.forEach(topic => {
          data.topics.push(topic.id);
        });

        this.assessmentService.reorderTopics(assessmentId, data).subscribe(() => {
          this.alertService.success(this.translateService.instant('assessmentBuilder.topicEditSuccess'));
        });
      }
      this.reorder = false;
      this.changedOrder = false;
    }
  }

  // To reorder the topics in the topics list after drop
  public dropTopic(event: CdkDragDrop<object[]>): void {
    moveItemInArray(this.assessment.topics, event.previousIndex, event.currentIndex);
    this.changedOrder = true;
  }

  // Go back to previous order
  public cancelReorder(): void {
    this.assessment.topics = this.topicToOrder;
    this.reorder = false;
  }
}
