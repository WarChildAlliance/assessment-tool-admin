import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import { AssessmentDashboard } from 'src/app/core/models/assessment-dashboard.model';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Group } from 'src/app/core/models/group.model';

@Component({
  selector: 'app-score-by-question-set-chart',
  templateUrl: './score-by-question-set-chart.component.html',
  styleUrls: ['./score-by-question-set-chart.component.scss']
})
export class ScoreByQuestionSetChartComponent implements OnInit {

  public studentsListChart: ChartDataSets[];

  public selectedStudent: ChartDataSets;

  public hasData = true;
  public selectionHasData = true;
  public loading = true;

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


  private lineChart: Chart;
  private questionSetsName = [];
  private questionSetsAverage = [];
  private assessment: AssessmentDashboard;
  private selectedGroupIds: number[] = [];

  constructor(
    private userService: UserService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
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
    this.loading = true;
    if (assessment && assessment.started) {
      this.assessment = assessment;
      this.questionSetsName = [];
      this.questionSetsAverage = [];

      this.lineChart = new Chart('currentChart', {
        type: 'line',
        data: this.lineChartData,
        options: this.lineChartOptions,
      });

      assessment.question_sets.forEach(questionSet => {
          this.questionSetsName.push(questionSet.name);
          this.questionSetsAverage.push(questionSet.average);
      });
      this.getStudentQuestionSetsChart(assessment.id, this.selectedGroupIds);
    } else {
      this.selectionHasData = false;
      this.loading = false;
    }
  }

  public onGroupsSelection(groupsIds: number[]): void {
    this.selectedGroupIds = groupsIds;
    this.getStudentQuestionSetsChart(this.assessment.id, this.selectedGroupIds);
  }

  private getChartLineData(studentsList: {full_name: string; question_sets: any[]}[],
    questionSetNames: string[], questionSetsAverage: number[]): void{
    if (studentsList?.length === 0) {
      this.selectionHasData = false;
      return;
    }
    this.studentsListChart = [];
    this.lineChart.data.datasets = [];
    this.lineChart.data.labels = questionSetNames;
    this.lineChart.data.datasets.push({
      label: 'Average',
      data: questionSetsAverage,
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

      student.question_sets.forEach(questionSet => {
        if (Object.values(questionSet)[0] !== 'not_evaluated') {
          if (typeof Object.values(questionSet)[0] === 'number') {
            lineChartDataObj.data.push(Object.values(questionSet)[0]);
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

  private getStudentQuestionSetsChart(assessmentId: string, groupIds: number[]): void {
    this.loading = true;
    this.userService.getStudentQuestionSetsChart(assessmentId).subscribe(scoreByQuestionSet => {
      const filteredScoreByQuestionSet = scoreByQuestionSet.filter(el => {
        const groups = el.group as Group[];
        let hasSelectedGroup = groupIds?.length === 0;

        for (let i = 0; !hasSelectedGroup && i < groups.length; ++i) {
          if (groupIds?.includes(groups[i].id)) {
            hasSelectedGroup = true;
          }
        }
        return el.student_access && hasSelectedGroup;
      });
      this.getChartLineData(filteredScoreByQuestionSet, this.questionSetsName, this.questionSetsAverage);
      this.loading = false;
    });
  }
}
