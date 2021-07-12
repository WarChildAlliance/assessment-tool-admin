import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-answers-overview',
  templateUrl: './answers-overview.component.html',
  styleUrls: ['./answers-overview.component.scss']
})
export class AnswersOverviewComponent implements OnInit {

  public studentsList;
  public topicId: string;
  public assessmentTopicAnswer: string;
  public studentTopicAnswers;

  public answerDetails;

  public evaluated: boolean;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onTopicSelection(ids): void {
    this.topicId = ids.topic.id;
    this.evaluated = ids.topic.evaluated;
    this.userService.getStudentsListForATopic(this.topicId).subscribe(studentsList => {
      this.studentsList = studentsList;
    });
  }

  selectStudent(student): void {
    this.assessmentTopicAnswer = student.topic_first_try.id;
    this.userService.getAsnwersOverview(this.topicId, student.topic_first_try.id).subscribe(topicAnswers => {
      this.studentTopicAnswers = topicAnswers;
    });
  }

  isAnswerValid(validity): string {
    if (validity) {
      return '#7EBF9A';
    } else {
      return '#F2836B';
    }
  }

  displayAnswerDetails(answer): void {
    this.userService.getAnswerDetails(this.topicId, this.assessmentTopicAnswer, answer.id).subscribe(answerDetails => {
      this.answerDetails = answerDetails;
    });
  }

}
