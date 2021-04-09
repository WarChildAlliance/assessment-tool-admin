import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assessment } from '../core/models/assessment.model';
import { AssessmentService } from '../core/services/assessment.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  displayedColumns: string[] = ['title', 'grade', 'subject', 'language', 'country', 'private', 'arrow'];
  assessmentsList: Assessment[] = [];

  constructor(private assessmentService: AssessmentService, private router: Router) { }

  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe(res => {
      this.assessmentsList = res;
    });
  }
}
