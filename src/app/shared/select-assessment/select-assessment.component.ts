import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
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
  @Input() displayNonEvaluated: boolean;

  @Output() assessmentSelection = new EventEmitter<string>(true);
  @Output() topicSelection = new EventEmitter<{assessmentId: string, topic: any}>(true);

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.assessmentService.completeAssessmentsList.pipe(first()).subscribe(assessmentsList => {
      this.assessmentsList = assessmentsList;
      this.selectedAssessment = this.assessmentsList[0];

      if (this.selectTopic) {
        this.assessmentId = this.assessmentsList[0].id;
        this.getTopics(this.assessmentsList[0].id);
        this.selectedTopic = this.topicsList[0];
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
    this.topicSelection.emit({assessmentId: this.assessmentId, topic});
  }

  getTopics(assessmentId: string): void{
    this.assessmentService.getTopicsListForDashboard(assessmentId).subscribe(topics => {
      this.topicsList = topics;

      if (this.firstTopicRequest) {
        this.topicSelection.emit({assessmentId: this.assessmentId, topic: this.topicsList[0]});
        this.firstTopicRequest = false;
      }
    });
  }

}
