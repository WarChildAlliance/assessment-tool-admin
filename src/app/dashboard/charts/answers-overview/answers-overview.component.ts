import { Component, OnInit } from '@angular/core';
import { AnswerDetails } from 'src/app/core/models/answer-details.model';
import { TopicAccessStudents } from 'src/app/core/models/topic-access-students.model';
import { TopicAnswer } from 'src/app/core/models/topic-answer.model';
import { TopicDashboard } from 'src/app/core/models/topic-dashboard.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-answers-overview',
  templateUrl: './answers-overview.component.html',
  styleUrls: ['./answers-overview.component.scss']
})
export class AnswersOverviewComponent implements OnInit {

  public studentsList: TopicAccessStudents[];
  public topicId: string;
  public assessmentTopicAnswer: string;
  public studentTopicAnswers: TopicAnswer[];

  public answerDetails: AnswerDetails;

  public evaluated: boolean;

  public selectedStudent: TopicAccessStudents;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onTopicSelection(assessmentTopicInfos: {assessmentId: string, topic: TopicDashboard}): void {
    this.topicId = assessmentTopicInfos.topic.id;
    this.evaluated = assessmentTopicInfos.topic.evaluated;
    this.userService.getStudentsListForATopic(this.topicId).subscribe(studentsList => {
      this.studentsList = studentsList;
      this.selectedStudent = this.studentsList[0];
      this.selectStudent(this.studentsList[0]);
    });
  }

  selectStudent(student: TopicAccessStudents): void {
    this.selectedStudent = student;
    this.assessmentTopicAnswer = student.topic_first_try.id;
    this.userService.getStudentTopicAnswers(this.topicId, student.topic_first_try.id).subscribe(topicAnswers => {
      this.studentTopicAnswers = topicAnswers;
      this.displayAnswerDetails(this.studentTopicAnswers[0]);
    });
  }

  isAnswerValid(validity: boolean): string {
    if (validity) {
      return '#7EBF9A';
    } else {
      return '#F2836B';
    }
  }

  displayAnswerDetails(answer: TopicAnswer): void {
    this.userService.getAnswerDetails(this.topicId, this.assessmentTopicAnswer, answer.id).subscribe(answerDetails => {
      this.answerDetails = answerDetails;
    });
  }

}
