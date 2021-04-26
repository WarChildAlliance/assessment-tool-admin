import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { Assessment } from 'src/app/core/models/assessment.model';
import { Topic } from 'src/app/core/models/topic.models';
import { User } from 'src/app/core/models/user.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-topic-accesses-builder',
  templateUrl: './topic-accesses-builder.component.html',
  styleUrls: ['./topic-accesses-builder.component.scss']
})
export class TopicAccessesBuilderComponent implements OnInit {

  @Input() studentsList: User[];

  assessmentsList: Assessment[] = [];
  topicsList: Topic[] = [];

  selectedTopics: SelectionModel<Topic> = new SelectionModel(true)

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      const filteredAssessment = assessmentsList.filter((assessment) => (assessment.country === this.studentsList[0].country && assessment.language === this.studentsList[0].language));
      this.assessmentsList = filteredAssessment;
    });
  }

  loadTopicsList(assessmentId: string): void {
    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((newList) => {
      this.topicsList = newList;
    });
  }

  input(event, top) {
    console.log("AHAHAHA INPUT", event);
    console.log("INPUT 2", top);
  }

  change(event, top) {
    console.log("AHAHAHA CHANGE", event);
    console.log("CHANGE 2", top);}
}
