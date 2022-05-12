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

  private assessmentId: string;
  private firstTopicRequest = true;

  public assessmentsList: AssessmentDashboard[];
  public topicsList: TopicDashboard[];

  public selectedAssessment: AssessmentDashboard;
  public selectedAssessmentArr: AssessmentDashboard[];
  public selected: AssessmentDashboard[] = [];
  public selectedTopic: TopicDashboard;

  @Input() selectTopic: boolean;
  @Input() multiple: boolean;
  @Input() displayNonEvaluated: boolean;

  @Output() assessmentSelection = new EventEmitter<AssessmentDashboard>();
  @Output() topicSelection = new EventEmitter<{assessmentId: string, topic: TopicDashboard}>();

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.assessmentService.completeAssessmentsList.pipe(first()).subscribe(assessmentsList => {
      this.assessmentsList = assessmentsList.filter(assessment => assessment.archived !== true);
      this.selectedAssessment = this.assessmentsList.find(el => el.started);
      this.selectedAssessmentArr = this.assessmentsList.filter(el => el.started).slice(0, 1);

      if (this.selectTopic) {
        if (this.selectedAssessment){
          this.assessmentId = this.selectedAssessment.id;
          this.getTopics(this.assessmentId);
        }
      } else {
        this.assessmentSelection.emit(this.selectedAssessment);
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
        this.selectedTopic = this.topicsList.find(el => el.started);
        this.topicSelection.emit({assessmentId: this.assessmentId, topic: this.selectedTopic});
        this.firstTopicRequest = false;
      }
    });
  }

}
