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

  public lineChartOptions: ChartOptions = {
    responsive: true,
    showLines: false,
    scales: {
      yAxes: [{ gridLines: { display: false } }],
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
    this.lineChart = new Chart('currentChart', {
      type: 'line',
      data: this.lineChartData,
      options: this.lineChartOptions,
    });
  }

  selectStudent(student): void{
    if (this.lineChart.data.datasets.length > 1) {
      this.lineChart.data.datasets.splice(-1, 1);
    }
    this.lineChart.data.datasets.push(student);
    this.lineChart.update();
  }

  selectChartAssessment(assessment: AssessmentDashboard): void {
    this.userService.getStudentTopicsChart(assessment.id).subscribe(scoreByTopic => {
      this.getChartLineData(scoreByTopic, assessment);
    });
  }

  getChartLineData(studentsList: {full_name: string, topics: {}[]}[], assessment: AssessmentDashboard): void{
    this.studentsListChart = [];
    this.lineChart.data.datasets = [];
    this.lineChart.data.labels = assessment.topics;
    this.lineChart.data.datasets.push({
      label: 'Average',
      data: assessment.topics_average,
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
        pointBackgroundColor: '#248dd4,',
        borderColor: '#248dd4,'
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
