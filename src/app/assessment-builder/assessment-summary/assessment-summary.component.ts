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
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { environment } from 'src/environments/environment';
import { AssessmentFormDialogComponent } from '../assessment-form-dialog/assessment-form-dialog.component';
import { TopicFormDialogComponent } from '../topic-form-dialog/topic-form-dialog.component';

@Component({
  selector: 'app-assessment-summary',
  templateUrl: './assessment-summary.component.html',
  styleUrls: ['./assessment-summary.component.scss']
})
export class AssessmentSummaryComponent implements OnInit {

  @Input() assessment;
  @Input() canEdit: boolean;

  @Output() archivedAssessment = new EventEmitter<boolean>();

  public assessmentId: string;

  public edit: boolean;
  public smallScreen: boolean;
  public leftScrollEnabled = false;
  public rightScrollEnabled = true;

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

  getAssessmentDetails(assessmentId: string): void {
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe(() => {
      this.assessmentService.getAssessmentDetails(assessmentId).subscribe(assessmentDetails => {
        this.assessment = assessmentDetails;
        this.orderTopics();
      });
    });
  }

  openCreateTopicDialog(assessmentId: string): void {
    this.assessmentId = assessmentId;

    const createTopicDialog = this.dialog.open(TopicFormDialogComponent, {
      data: {
        assessmentId: this.assessmentId
      }
    });

    createTopicDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getAssessmentDetails(this.assessmentId);
      }
    });
  }

  // deleteAssessment(assessmentId: string): void {
  //   console.log('id', assessmentId)
  // }

  archiveTopic(assessmentId, topicId, archived): void {
    const formData: FormData = new FormData();
    formData.append('archived', archived);

    this.assessmentService.editTopic(assessmentId.toString(), topicId, formData).subscribe(() => {
      this.alertService.success(this.translateService.instant('assessmentBuilder.topicEditSuccess'));
      this.getAssessmentDetails(assessmentId);
    });
  }

  archiveAssessment(assessmentId, archived): void {
    const formData: FormData = new FormData();
    formData.append('archived', archived);

    this.assessmentService.editAssessment(assessmentId, formData).subscribe(res => {
      this.alertService.success(this.translateService.instant('assessmentBuilder.assessmentEditSuccess'));
      this.archivedAssessment.emit(true);
    });
  }

  editAssessment(assessment): void{
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
          this.archivedAssessment.emit(true);
        }
        this.getAssessmentDetails(this.assessment.id);
      }
    });
  }

  goToTopicDetails(assessmentId, topicId): void {
    this.router.navigate([`${assessmentId}/topic/${topicId}`], { relativeTo: this.route });
  }

  getSource(path: string): string {
    return `${environment.API_URL}${path}`;
  }

  getMediaSource(path: string): string {
    return `${environment.API_URL}/media/${path}`;
  }

  orderTopics(): void {
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
}
