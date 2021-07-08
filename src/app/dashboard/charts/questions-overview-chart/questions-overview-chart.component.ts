import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData } from 'chart.js';
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
          const datasetIndex =  this.barChart.getElementAtEvent(event)[0]['_index'];
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
  }

  getQuestionDetails(index): any {
    this.assessmentService.getQuestionDetails(this.assessmentId, this.topicId, this.questionData[index].id).subscribe(details => {
      this.questionDetails = details;
    });
  }

  onTopicSelection(ids): void {
    this.assessmentId = ids.assessmentId;
    this.topicId = ids.topicId;
    this.assessmentService.getQuestionsOverview(ids.assessmentId, ids.topicId).subscribe(data => {
      this.getBarChartData(data);
    });
  }

}
