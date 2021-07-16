import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { AssessmentDashboard } from 'src/app/core/models/assessment-dashboard.model';
import { TopicDashboard } from 'src/app/core/models/topic-dashboard.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-select-assessment',
  templateUrl: './select-assessment.component.html',
  styleUrls: ['./select-assessment.component.scss']
})
export class SelectAssessmentComponent implements OnInit {

  public assessmentsList: AssessmentDashboard[];
  public topicsList: TopicDashboard[];

  public selectedAssessment: AssessmentDashboard;
  public selectedAssessmentArr: AssessmentDashboard[];
  public selected: AssessmentDashboard[] = [];
  public selectedTopic: TopicDashboard;

  private assessmentId: string;

  private firstTopicRequest = true;

  @Input() selectTopic: boolean;
  @Input() multiple: boolean;
  @Input() displayNonEvaluated: boolean;

  @Output() assessmentSelection = new EventEmitter<AssessmentDashboard>();
  @Output() topicSelection = new EventEmitter<{assessmentId: string, topic: TopicDashboard}>();

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.assessmentService.completeAssessmentsList.pipe(first()).subscribe(assessmentsList => {
      this.assessmentsList = assessmentsList;
      this.selectedAssessment = this.assessmentsList[0];
      this.selectedAssessmentArr = this.assessmentsList.slice(0, 1);

      if (this.selectTopic) {
        this.assessmentId = this.assessmentsList[0].id;
        this.getTopics(this.assessmentsList[0].id);
      } else {
        this.assessmentSelection.emit(this.assessmentsList[0]);
      }
    });
  }

  selectAssessment(assessment: AssessmentDashboard): void {
    this.selectedAssessment = assessment;
    if (this.selectTopic){
      this.assessmentId = assessment.id;
      this.getTopics(assessment.id);
    } else {
      this.assessmentSelection.emit(assessment);
    }
  }

  selectATopic(topic: TopicDashboard): void {
    this.selectedTopic = topic;
    this.topicSelection.emit({assessmentId: this.assessmentId, topic});
  }

  getTopics(assessmentId: string): void{
    this.assessmentService.getTopicsListForDashboard(assessmentId).subscribe(topics => {
      this.topicsList = topics;

      if (this.firstTopicRequest) {
        this.selectedTopic = this.topicsList[0];
        this.topicSelection.emit({assessmentId: this.assessmentId, topic: this.topicsList[0]});
        this.firstTopicRequest = false;
      }
    });
  }

}
