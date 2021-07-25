import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData } from 'chart.js';
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

  public questionDetails;

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.barChart = new Chart('barChart', {
      type: 'horizontalBar',
      data: this.barChartData,
      options: {
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
  }

  getBarChartData(questionData): void {
    this.questionData = [];
    const data = [];
    const incorrectAnswers = [];
    this.barChart.data.labels = [];
    this.barChart.data.datasets = [];
    questionData.forEach(val => {
      this.questionData.push(val);
      this.barChart.data.labels.push('Q' + val.order);
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
    this.getQuestionDetails(0);
  }

  getQuestionDetails(index): any {
    this.assessmentService.getQuestionDetails(this.assessmentId, this.topicId, this.questionData[index].id).subscribe(details => {
      this.questionDetails = details;
    });
  }

  onTopicSelection(assessmentTopicInfos: {assessmentId: string, topic: TopicDashboard}): void {
    this.assessmentId = assessmentTopicInfos.assessmentId;
    this.topicId = assessmentTopicInfos.topic.id;
    this.assessmentService.getQuestionsOverview(assessmentTopicInfos.assessmentId, this.topicId).subscribe(data => {
      this.getBarChartData(data);
    });
  }

}
