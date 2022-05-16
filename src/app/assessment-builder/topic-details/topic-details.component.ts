import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { QuestionInputFormComponent } from '../questions/question-input-form/question-input-form.component';
import { QuestionNumberlineFormComponent } from '../questions/question-numberline-form/question-numberline-form.component';
import { QuestionSelectFormComponent } from '../questions/question-select-form/question-select-form.component';
import { TopicFormDialogComponent } from '../topic-form-dialog/topic-form-dialog.component';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss']
})

export class TopicDetailsComponent implements OnInit {

  public assessmentId: string;
  public topicId: string;

  public topic;

  public questionsArray: any[] = [
    {
    type: 'SELECT',
    text: '(Multi-)Select',
    component: QuestionSelectFormComponent
    },
    {
    type: 'INPUT',
    text: 'Input',
    component: QuestionInputFormComponent
    },
    {
    type: 'NUMBER_LINE',
    text: 'Number Line',
    component: QuestionNumberlineFormComponent
    },
];

  public order: number;

  public questionsList: any[];
  public topicDetails;

  constructor(
    private dialog: MatDialog,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.assessmentId = params.assessment_id;
      this.topicId = params.topic_id;

      this.getQuestionsList();
      this.getTopicDetails();
    });
  }

  getQuestionsList(): void {
    this.assessmentService.getQuestionsList(this.assessmentId, this.topicId).subscribe(questionList => {
      if (questionList.length) {
        this.questionsList = questionList;
        this.order = questionList.sort((a, b) => parseFloat(a.order) - parseFloat(b.order))[questionList.length - 1].order + 1;
      } else {
        this.order = 1;
      }
    });
  }

  getTopicDetails(): void {
    this.assessmentService.getTopicDetails(this.assessmentId, this.topicId).subscribe(topicDetails => {
      this.topicDetails = topicDetails;
    });
  }

  openEditTopicDialog(topic): void {
    this.topic = topic;
    const createTopicDialog = this.dialog.open(TopicFormDialogComponent, {
      data: {
        assessmentId: this.assessmentId,
        edit: true,
        topic: this.topic
      }
    });
    createTopicDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getTopicDetails();
      }
    });
  }

  openQuestionDialog(question?: any, clone?: boolean, type?: string): void {
    const questionType = question ? question.question_type : type;
    // Use question array to open the dialog corresponding to the question type, using the component attribute
    const questionDialog = this.dialog.open(this.questionsArray.find(x => (questionType === x.type)).component, {
      data: {
        topicId: this.topicId,
        order: this.order,
        question: question ?? null,
        toClone: clone ? true : false,
        assessmentId: this.assessmentId
      }
    });
    questionDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getQuestionsList();
      }
    });
  }
}
