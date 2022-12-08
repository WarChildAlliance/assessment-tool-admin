import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData } from 'chart.js';
import { QuestionSetDashboard } from 'src/app/core/models/question-set-dashboard.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-questions-overview-chart',
  templateUrl: './questions-overview-chart.component.html',
  styleUrls: ['./questions-overview-chart.component.scss']
})
export class QuestionsOverviewChartComponent implements OnInit {

  public assessmentId: string;
  public questionSetId: string;

  public questionDetails: any;

  public index: number;

  public hasData = true;
  public selectionHasData = true;
  public loading = true;

  private barChart: Chart;

  private barChartData: ChartData = {
    labels: [],
    datasets: []
  };

  private questionData = [];
  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
  }

  public onQuestionSetSelection(assessmentQuestionSetInfos: {assessmentId: string; questionSet: QuestionSetDashboard}): void {
    this.loading = true;
    this.assessmentId = assessmentQuestionSetInfos?.assessmentId;

    if (assessmentQuestionSetInfos?.questionSet.started) {
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
            /* eslint-disable @typescript-eslint/dot-notation */
            const datasetIndex =  this.barChart.getElementAtEvent(event)[0]['_index'];
            /* eslint-enable @typescript-eslint/dot-notation */
            this.getQuestionDetails(datasetIndex);
          }
        },
      });
      this.questionSetId = assessmentQuestionSetInfos.questionSet.id;
      this.getQuestionsOverview();
    } else {
      this.hasData = false;
    }
  }

  public getQuestionsOverview(groupID?: number[]): void {
    this.loading = true;
    const filteringParams = groupID?.length ? { groups: groupID } : null;
    this.assessmentService.getQuestionsOverview(this.assessmentId, this.questionSetId, filteringParams)
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
    this.assessmentService.getQuestionDetails(this.assessmentId, this.questionSetId, this.questionData[index].id).subscribe(details => {
      this.questionDetails = details;
      this.loading = false;
    });
  }
}
