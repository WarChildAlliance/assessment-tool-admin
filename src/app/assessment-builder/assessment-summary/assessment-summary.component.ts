import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute, ) { }

  ngOnInit(): void {}

  openCreateTopicDialog(assessmentId: string): void {
    this.assessmentId = assessmentId;
    this.dialog.open(this.createTopicDialog);
  }

  // deleteAssessment(assessmentId: string): void {
  //   console.log('id', assessmentId)
  // }

  editAssessment(assessment): void{
    this.edit = true;
    this.assessment = assessment;
    this.dialog.open(this.createAssessmentDialog);
  }

  goToTopicDetails(assessmentId, topicId): void {
    this.router.navigate([`${assessmentId}/topic/${topicId}`], { relativeTo: this.route });
  }

  getSource(path: string): string {
    return environment.API_URL + path;
  }

}
