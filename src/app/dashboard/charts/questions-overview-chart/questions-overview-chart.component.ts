import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData } from 'chart.js';
import { filter } from 'rxjs/operators';
import { TopicDashboard } from 'src/app/core/models/topic-dashboard.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-questions-overview-chart',
  templateUrl: './questions-overview-chart.component.html',
  styleUrls: ['./questions-overview-chart.component.scss']
})
export class QuestionsOverviewChartComponent implements OnInit {

  private barChart: Chart;

  private barChartData: ChartData = {
    labels: [],
    datasets: []
  };

  private questionData = [];

  private assessmentId: string;
  private topicId: string;

  public questionDetails: any;

  public index: number;

  public hasData = true;
  public selectionHasData = true;
  public loading = true;

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
  }

  public getQuestionsOverview(groupID?: number[]): void {
    this.loading = true;
    const filteringParams = groupID?.length ? { groups: groupID } : null;
    this.assessmentService.getQuestionsOverview(this.assessmentId, this.topicId, filteringParams)
    .subscribe(data => {
      this.getBarChartData(data);
    });
  }

  private getBarChartData(questionData): void {
    if (questionData?.length === 0) {
      this.selectionHasData = false;
      this.loading = false;
      return;
    }
    this.questionData = [];
    const data = [];
    const incorrectAnswers = [];
    this.barChart.data.labels = [];
    this.barChart.data.datasets = [];
    questionData.forEach((val, i) => {
      this.questionData.push(val);
      this.barChart.data.labels.push('Q' + (i + 1));
      data.push(val.correct_answers_count);
      incorrectAnswers.push(val.incorrect_answers_count);
    });
    this.barChart.data.datasets.push({
        label: 'Correct answers',
        data,
        backgroundColor: '#7EBF9A'
    }, {
      label: 'Incorrect answers',
      data: incorrectAnswers,
      backgroundColor: '#F2836B'
    });

    this.barChart.update();
    this.selectionHasData = true;
    this.getQuestionDetails(0);
  }

  private getQuestionDetails(index): any {
    this.index = index + 1;
    this.assessmentService.getQuestionDetails(this.assessmentId, this.topicId, this.questionData[index].id).subscribe(details => {
      this.questionDetails = details;
      this.loading = false;
    });
  }

  public onTopicSelection(assessmentTopicInfos: {assessmentId: string, topic: TopicDashboard}): void {
    this.loading = true;
    this.assessmentId = assessmentTopicInfos?.assessmentId;

    if (assessmentTopicInfos?.topic.started) {
      this.barChart = new Chart('barChart', {
        type: 'horizontalBar',
        data: this.barChartData,
        options: {
          maintainAspectRatio: false,
          scales: {
              xAxes: [{
                  ticks: {
                      beginAtZero: true,
                      stepSize: 1
                  },
                  stacked: true
              }],
              yAxes: [{
                stacked: true
              }]
          },
          onClick: event => {
            /* tslint:disable:no-string-literal */
            const datasetIndex =  this.barChart.getElementAtEvent(event)[0]['_index'];
            /* tslint:enable:no-string-literal */
            this.getQuestionDetails(datasetIndex);
          }
        },
      });
      this.topicId = assessmentTopicInfos.topic.id;
      this.getQuestionsOverview();
    } else {
      this.hasData = false;
    }
  }
}
