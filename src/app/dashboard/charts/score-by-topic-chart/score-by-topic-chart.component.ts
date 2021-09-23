import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import { AssessmentDashboard } from 'src/app/core/models/assessment-dashboard.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-score-by-topic-chart',
  templateUrl: './score-by-topic-chart.component.html',
  styleUrls: ['./score-by-topic-chart.component.scss']
})
export class ScoreByTopicChartComponent implements OnInit {

  public studentsListChart: ChartDataSets[];
  private lineChart: Chart;

  public selectedStudent: ChartDataSets;

  public hasData = true;

  topicsName = [];
  topicsAverage = [];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    showLines: false,
    scales: {
      yAxes: [{ gridLines: { display: false }, ticks: {min: 0, max: 100} }],
      xAxes: [{ gridLines: { lineWidth: 2, color: 'darkgrey' } }]
    },
    elements: {
      point: {
        radius: 12
      },
      line: {
        borderWidth: 0
      }
    }
  };

  public lineChartData: ChartData = {
    labels: [],
    datasets: []
  };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  selectStudent(student): void{
    if (this.lineChart.data.datasets.length > 1) {
      this.lineChart.data.datasets.splice(-1, 1);
    }
    this.lineChart.data.datasets.push(student);
    this.lineChart.update();
  }

  selectChartAssessment(assessment: AssessmentDashboard): void {

    if (assessment.started) {
      this.topicsName = [];
      this.topicsAverage = [];

      this.lineChart = new Chart('currentChart', {
        type: 'line',
        data: this.lineChartData,
        options: this.lineChartOptions,
      });

      assessment.topics.forEach(topic => {
          this.topicsName.push(topic.name);
          this.topicsAverage.push(topic.average);
      });

      this.userService.getStudentTopicsChart(assessment.id).subscribe(scoreByTopic => {
        const filteredScoreByTopic = scoreByTopic.filter(el => el.student_access);
        this.getChartLineData(filteredScoreByTopic, this.topicsName, this.topicsAverage);
      });
    } else {
      this.hasData = false;
    }
  }

  getChartLineData(studentsList: {full_name: string, topics: {}[]}[], topicNames: string[], topicsAverage: number[]): void{
    this.studentsListChart = [];
    this.lineChart.data.datasets = [];
    this.lineChart.data.labels = topicNames;
    this.lineChart.data.datasets.push({
      label: 'Average',
      data: topicsAverage,
      pointStyle: 'circle'
    });

    this.lineChart.update();

    let lineChartDataObj;
    studentsList.forEach(student  => {
      lineChartDataObj = {
        label: student.full_name,
        data: [],
        fill: false,
        pointStyle: 'rect',
        pointBackgroundColor: 'rgba(251, 192, 45, 1)',
        borderColor: 'rgba(251, 192, 45, 1)'
      };

      student.topics.forEach(topic => {
        if (Object.values(topic)[0] !== 'not_evaluated') {
          if (typeof Object.values(topic)[0] === 'number') {
            lineChartDataObj.data.push(Object.values(topic)[0]);
          } else {
            lineChartDataObj.data.push(null);
          }
        }
      });
      this.studentsListChart.push(lineChartDataObj);
    });
    this.selectedStudent = this.studentsListChart[0];
    this.selectStudent(this.selectedStudent);
  }

}
