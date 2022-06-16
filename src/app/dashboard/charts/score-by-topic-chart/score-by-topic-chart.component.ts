import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import { AssessmentDashboard } from 'src/app/core/models/assessment-dashboard.model';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Group } from 'src/app/core/models/group.model';

@Component({
  selector: 'app-score-by-topic-chart',
  templateUrl: './score-by-topic-chart.component.html',
  styleUrls: ['./score-by-topic-chart.component.scss']
})
export class ScoreByTopicChartComponent implements OnInit {

  private lineChart: Chart;
  private topicsName = [];
  private topicsAverage = [];
  private assessment: AssessmentDashboard;
  private selectedGroupIds: number[] = [];

  public studentsListChart: ChartDataSets[];

  public selectedStudent: ChartDataSets;

  public hasData = true;
  public selectionHasData = true;

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

  constructor(
    private userService: UserService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  private getChartLineData(studentsList: {full_name: string, topics: {}[]}[], topicNames: string[], topicsAverage: number[]): void{
    if (studentsList?.length === 0) {
      this.selectionHasData = false;
      return;
    }
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

  private getStudentTopicsChart(assessmentId: string, groupIds: number[]): void {
    this.userService.getStudentTopicsChart(assessmentId).subscribe(scoreByTopic => {
      const filteredScoreByTopic = scoreByTopic.filter(el => {
        const groups = el.group as Group[];
        let hasSelectedGroup = groupIds?.length === 0;

        for (let i = 0; !hasSelectedGroup && i < groups.length; ++i) {
          if (groupIds?.includes(groups[i].id)) {
            hasSelectedGroup = true;
          }
        }
        return el.student_access && hasSelectedGroup;
      });
      this.getChartLineData(filteredScoreByTopic, this.topicsName, this.topicsAverage);
    });
  }

  public selectStudent(student): void{
    if (this.lineChart.data.datasets.length > 1) {
      this.lineChart.data.datasets.splice(-1, 1);
    }
    this.lineChart.data.datasets.push(student);
    this.lineChart.update();
    this.selectionHasData = true;
  }

  public selectChartAssessment(assessment: AssessmentDashboard): void {
    if (assessment && assessment.started) {
      this.assessment = assessment;
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
      this.getStudentTopicsChart(assessment.id, this.selectedGroupIds);
    } else {
      this.hasData = false;
    }
  }

  public onGroupsSelection(groupsIds: number[]): void {
    this.selectedGroupIds = groupsIds;
    this.getStudentTopicsChart(this.assessment.id, this.selectedGroupIds);
  }
}
