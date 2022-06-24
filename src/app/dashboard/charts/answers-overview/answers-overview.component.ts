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

  public index = 0;

  public selectedStudent: TopicAccessStudents;

  public hasData = true;
  public loading = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {}

  public getStudentListForTopic(groupID?: number[]): void {
    this.loading = true;
    const filteringParams = groupID?.length ? { groups: groupID } : null;

    this.userService.getStudentsListForATopic(this.topicId, filteringParams)
    .subscribe(studentsList => {
      this.studentsList = studentsList;
      this.selectedStudent = this.studentsList.find(s => s.topic_first_try !== null);
      if (this.selectedStudent) {
        this.selectStudent(this.selectedStudent);
      }
      this.loading = false;
    });
  }

  public onTopicSelection(assessmentTopicInfos: {assessmentId: string, topic: TopicDashboard}): void {
    this.loading = true;
    if (assessmentTopicInfos && assessmentTopicInfos.topic.started) {
      this.topicId = assessmentTopicInfos.topic.id;
      this.evaluated = assessmentTopicInfos.topic.evaluated;
      this.getStudentListForTopic();
    } else {
      this.hasData = false;
      this.loading = false;
    }
  }

  public selectStudent(student: TopicAccessStudents): void {
    this.loading = true;
    this.selectedStudent = student;
    if (student.topic_first_try) {
      this.assessmentTopicAnswer = student.topic_first_try.id;
      this.userService.getStudentTopicAnswers(this.topicId, student.topic_first_try.id).subscribe(topicAnswers => {
        this.studentTopicAnswers = topicAnswers;
        this.displayAnswerDetails(this.studentTopicAnswers[0]);
      });
    }
    this.loading = false;
  }

  public isAnswerValid(validity: boolean): string {
    if (validity) {
      return '#7EBF9A';
    } else {
      return '#F2836B';
    }
  }

  public displayAnswerDetails(answer: TopicAnswer): void {
    this.userService.getAnswerDetails(this.topicId, this.assessmentTopicAnswer, answer.id).subscribe(answerDetails => {
      this.answerDetails = answerDetails;
    });
  }
}
