import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AssessmentDashboard } from 'src/app/core/models/assessment-dashboard.model';
import { UserService } from 'src/app/core/services/user.service';
import { Group } from 'src/app/core/models/group.model';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-by-topic-table',
  templateUrl: './score-by-topic-table.component.html',
  styleUrls: ['./score-by-topic-table.component.scss']
})
export class ScoreByTopicTableComponent implements OnInit {
  private selectedAssessments: AssessmentDashboard[] = [];

  public studentsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: any[] = [
    { key: 'full_name', name: 'general.student'}
  ];

  public newTableData = [];

  public isAssessmentSelected = false;

  public scoreByTopicTable = [];

  public hasData = true;
  public loading = true;

  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
  }

  private getTableColumns(studentsList, assessmentTitle): any[]{
    const tableColumns = [];
    studentsList[0].topics.forEach(el => {
      const tableColumn = {key: '', name: '', type: '', assmnt: ''};
      const colName = Object.keys(el)[0].toLocaleLowerCase();
      tableColumn.key = colName;
      tableColumn.name = Object.keys(el)[0];
      tableColumn.type = 'circle';
      tableColumn.assmnt = assessmentTitle;
      tableColumns.push(tableColumn);
    });
    return tableColumns;
  }

  private getTableData(newAssessmentData): any[]{
    this.newTableData = [];
    newAssessmentData.forEach(assessmentData => {
      const studentObj = this.scoreByTopicTable.find(val => val.full_name === assessmentData.full_name);
      assessmentData.topics.forEach(topic => {
        studentObj[Object.keys(topic)[0].toLocaleLowerCase()] = Object.values(topic)[0];
      });
      this.newTableData.push(studentObj);
    });
    return this.newTableData;
  }

  private getScoreByTopicsData(assessment, instentiateTable: boolean, selectedGroupsIds: number[] = []): void {
    if (assessment && assessment.id){
      this.userService.getStudentTopicsChart(assessment.id).subscribe(scoreByTopic => {
        if (selectedGroupsIds.length) {
          scoreByTopic = scoreByTopic.filter(el => {
            const groups = el.group as Group[];
            let hasSelectedGroup = false;

            groups.map(group => {
              hasSelectedGroup = selectedGroupsIds.includes(group.id);
            });

            return hasSelectedGroup;
          });
        }
        if (scoreByTopic.length) {
          if (instentiateTable) {
            this.scoreByTopicTable = scoreByTopic;
          }
          this.displayedColumns = this.displayedColumns.concat(this.getTableColumns(scoreByTopic, assessment.title));
          this.studentsDataSource = new MatTableDataSource(this.getTableData(scoreByTopic));
        } else {
          this.hasData = false;
        }

        this.loading = false;
      });
    } else {
      this.hasData = false;
      this.loading = false;
    }
  }

  public selectTableAssessment(assessment: AssessmentDashboard): void {
    this.loading = true;

    if (!this.scoreByTopicTable.length) {
      this.selectedAssessments.push(assessment);
      this.getScoreByTopicsData(assessment, true);
    } else {
      const matchingCol = this.displayedColumns.find(val => val.assmnt === assessment.title);
      if (!matchingCol) {
        this.selectedAssessments.push(assessment);
        this.getScoreByTopicsData(assessment, false);
      } else {
        this.selectedAssessments.splice(this.selectedAssessments.indexOf(assessment), 1);
        this.displayedColumns = this.displayedColumns.filter(col => col.assmnt !== assessment.title);
        this.newTableData.forEach(data => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              assessment.topics.forEach(topic => {
                if (topic.name.toLocaleLowerCase() === key) {
                  delete data[key];
                }
              });
            }
          }
        });
        this.getTableData(this.newTableData);
      }
    }

    this.loading = false;
  }

  public onOpenStudentDetails(id: string): void {
    this.router.navigate([`/students/${id}`]);
  }

  public onGroupsSelection(groupIds: number[]): void {
    this.loading = true;

    for (const assessment of this.selectedAssessments) {
      this.displayedColumns = this.displayedColumns.filter(col => col.assmnt !== assessment.title);
      this.getScoreByTopicsData(assessment, false, groupIds);
    }
  }
}
