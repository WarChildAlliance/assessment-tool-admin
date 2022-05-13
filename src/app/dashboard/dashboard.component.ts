import { Component, OnInit } from '@angular/core';
import { AssessmentDashboard } from '../core/models/assessment-dashboard.model';
import { AssessmentService } from '../core/services/assessment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public studentsListTable = [];
  public assessmentList: AssessmentDashboard[];

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.assessmentService.getAssessmentsListforDashboard().subscribe((assessmentsList) => {
      this.assessmentService.updateAssessmentsList(assessmentsList);
    });
  }

}
