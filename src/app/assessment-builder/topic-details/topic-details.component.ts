import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss']
})
export class TopicDetailsComponent implements OnInit {

  public assessmentId: string;
  public topicId: string;

  public topic;

  public questionType: string;

  public order;

  public questionsList: any[];
  public topicDetails;

  public question;

  public toClone: boolean;

  @ViewChild('createTopicDialog') createTopicDialog: TemplateRef<any>;
  @ViewChild('editQuestionDialog') editQuestionDialog: TemplateRef<any>;
  @ViewChild('cloneQuestionDialog') cloneQuestionDialog: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.assessmentId = params.assessment_id;
      this.topicId = params.topic_id;

      this.assessmentService.getQuestionsList(this.assessmentId, this.topicId).subscribe(questionList => {

        if (questionList.length) {
          this.questionType = questionList[0].question_type;
          this.questionsList = questionList;
          this.order = questionList.sort((a, b) => parseFloat(a.order) - parseFloat(b.order))[questionList.length - 1].order + 1;
        } else {
          this.questionType = 'SELECT';
          this.order = 1;
        }
      });

      this.assessmentService.getTopicDetails(this.assessmentId, this.topicId).subscribe(topicDetails => {
        this.topicDetails = topicDetails;
      });
    });
  }

  openEditTopicDialog(topic): void {
    this.topic = topic;
    this.dialog.open(this.createTopicDialog);
  }

  onEditQuestionDialog(question): void {
    this.question = question;
    this.toClone = false;
    this.dialog.open(this.editQuestionDialog);
  }

  cloneQuestion(question): void  {
    this.toClone = true;
    this.question = question;
    this.dialog.open(this.editQuestionDialog);
  }

  setQuestionType(questionType: string): void {
    this.questionType = questionType;
  }

}