import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assessment-summary',
  templateUrl: './assessment-summary.component.html',
  styleUrls: ['./assessment-summary.component.scss']
})
export class AssessmentSummaryComponent implements OnInit {

  @Input() assessment;
  @Input() canEdit: boolean;

  public assessmentId: string;

  public edit: boolean;

  @ViewChild('createAssessmentDialog') createAssessmentDialog: TemplateRef<any>;
  @ViewChild('createTopicDialog') createTopicDialog: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {}


  private getAssessmentDetails(assessmentId: string): void {
    this.assessmentService.getAssessmentDetails(assessmentId).subscribe(assessmentDetails => {
      this.assessment = assessmentDetails;
    });
  }

  openCreateTopicDialog(assessmentId: string): void {
    this.assessmentId = assessmentId;

    const createTopicDialog = this.dialog.open(this.createTopicDialog);
    createTopicDialog.afterClosed().subscribe(
      () => {
      this.getAssessmentDetails(this.assessmentId);
      this.dialog.closeAll();
    });
  }

  // deleteAssessment(assessmentId: string): void {
  //   console.log('id', assessmentId)
  // }

  editAssessment(assessment): void{
    this.edit = true;
    this.assessment = assessment;
    const createAssessmentDialog = this.dialog.open(this.createAssessmentDialog);
    createAssessmentDialog.afterClosed().subscribe(
      () => {
        this.getAssessmentDetails(this.assessment.id);
        this.dialog.closeAll();
    });
  }

  goToTopicDetails(assessmentId, topicId): void {
    this.router.navigate([`${assessmentId}/topic/${topicId}`], { relativeTo: this.route });
  }

  getSource(path: string): string {
    return environment.API_URL + path;
  }

}
