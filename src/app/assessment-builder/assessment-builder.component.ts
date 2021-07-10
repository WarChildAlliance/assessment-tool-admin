import { Component, OnInit } from '@angular/core';
import { Assessment } from '../core/models/assessment.model';
import { Topic } from '../core/models/topic.models';
import { AssessmentService } from '../core/services/assessment.service';

@Component({
  selector: 'app-assessment-builder',
  templateUrl: './assessment-builder.component.html',
  styleUrls: ['./assessment-builder.component.scss']
})
export class AssessmentBuilderComponent implements OnInit {

  public currentAssessments: Assessment[] = [];
  public currentTopics: Topic[] = [];
  public currentQuestions: any[] = [];

  constructor(
    private assessmentService: AssessmentService,
  ) { }


  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.currentAssessments = assessmentsList;
    });
  }

  getCurrentTopics(id: number): void {
    this.assessmentService.getAssessmentTopics(id.toString()).subscribe((topicsList) => {
      this.currentTopics = topicsList;
    });
  }
}
