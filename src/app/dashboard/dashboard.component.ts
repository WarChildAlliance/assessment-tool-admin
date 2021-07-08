import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AssessmentService } from '../core/services/assessment.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public studentsListTable = [];
  public assessmentList = [];


  constructor(private userService: UserService, private assessmentService: AssessmentService) { }

  ngOnInit(): void {

    this.assessmentService.getAssessmentsListforDashboard().subscribe((assessmentsList) => {
      this.assessmentService.updateAssessmentsList(assessmentsList);
    });

  }

}
