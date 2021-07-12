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
  public currentTopics: any[] = [];
  public currentQuestions: any[] = [];

  constructor(
    private assessmentService: AssessmentService,
  ) { }


  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.currentAssessments = assessmentsList;
    });
  }

  getCurrentTopics(assessmentId: number): void {
    this.assessmentService.getAssessmentTopics(assessmentId.toString()).subscribe((topicsList) => {
      this.currentTopics = topicsList;
    });
  }

  getCurrentQuestions(assessmentId: number, topicId: number): void {
    this.assessmentService.getTopicQuestions(assessmentId.toString(), topicId.toString()).subscribe((questionsList) => {
      this.currentQuestions = questionsList;
    });
  }
}
