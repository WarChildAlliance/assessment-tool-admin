import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
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
  studentsSelection: SelectionModel<User>;

  assessmentsList: Assessment[] = [];
  topicsList: Topic[] = [];

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.studentsSelection = new SelectionModel<User>(true, this.studentsList);

    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.assessmentsList = assessmentsList;
    });
  }

  loadTopicsList(assessmentId: string): void {
    this.assessmentService.getAssessmentTopics(assessmentId);
  }



  log() {
    console.log(this.studentsSelection.selected);
  }

}
