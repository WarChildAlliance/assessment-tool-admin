import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-select-assessment',
  templateUrl: './select-assessment.component.html',
  styleUrls: ['./select-assessment.component.scss']
})
export class SelectAssessmentComponent implements OnInit {

  public assessmentsList;

  public selectedAssessment;
  public selectedTopic;

  public topicsList = [];

  private assessmentId: string;

  private firstTopicRequest = true;

  @Input() selectTopic: boolean;
  @Input() multiple: boolean;

  @Output() assessmentSelection = new EventEmitter<string>();
  @Output() topicSelection = new EventEmitter<{assessmentId: string, topicId: string}>();

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.assessmentService.completeAssessmentsList.subscribe(assessmentsList => {
      this.assessmentsList = assessmentsList;
      this.selectedAssessment = this.assessmentsList[0];

      if (this.selectTopic) {
        this.assessmentId = this.assessmentsList[0].id;
        this.getTopics(this.assessmentsList[0].id);
      } else {
        this.assessmentSelection.emit(this.assessmentsList[0]);
      }
    });
  }

  selectAssessment(assessment): void {
    this.selectedAssessment = assessment;
    if (this.selectTopic){
      this.assessmentId = assessment.id;
      this.getTopics(assessment.id);
    } else {
      this.assessmentSelection.emit(assessment);
    }
  }

  selectATopic(topic): void {
    this.selectedTopic = topic;
    this.topicSelection.emit({assessmentId: this.assessmentId, topicId: topic.id});
  }

  getTopics(assessmentId: string): void{
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe(topics => {
      this.topicsList = topics;

      if (this.firstTopicRequest) {
        this.selectedTopic = this.topicsList[0];
        this.topicSelection.emit({assessmentId: this.assessmentId, topicId: this.topicsList[0].id});
        this.firstTopicRequest = false;
      }
    });
  }

}
