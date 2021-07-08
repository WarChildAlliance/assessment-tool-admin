import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-score-by-topic-table',
  templateUrl: './score-by-topic-table.component.html',
  styleUrls: ['./score-by-topic-table.component.scss']
})
export class ScoreByTopicTableComponent implements OnInit {

  public studentsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: any[] = [
    { key: 'full_name', name: 'Student'}
  ];

  public newTableData = [];

  public isAssessmentSelected = false;

  public studentsListChart = [];
  public studentsListTable = [];
  public assessmentsList = [];

  public topicList = [];


  constructor(private userService: UserService) { }

  ngOnInit(): void {}

  selectTableAssessment(assessment): void {
    if (!this.studentsListTable.length) {
      this.getScoreByTopicsData(assessment, true);
    } else {
      const mathcingCol = this.displayedColumns.find(val => val.assmnt === assessment.title);
      if (!mathcingCol) {
        this.getScoreByTopicsData(assessment, false);
      } else {
        this.displayedColumns = this.displayedColumns.filter(col => col.assmnt !== assessment.title);
        this.newTableData.forEach(data => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              assessment.topics.forEach(topic => {
                if (topic.toLocaleLowerCase() === key) {
                  delete data[key];
                }
              });
            }
          }
        });
        this.getTableData(this.newTableData);
      }
    }
  }

  getTableColumns(studentsList, assessmentTitle): any[]{
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

  getTableData(newAssessmentData): any[]{
    this.newTableData = [];
    newAssessmentData.forEach(assessmentData => {
      const studentObj = this.studentsListTable.find(val => val.full_name === assessmentData.full_name);
      assessmentData.topics.forEach(topic => {
        studentObj[Object.keys(topic)[0].toLocaleLowerCase()] = Object.values(topic)[0];
      });
      this.newTableData.push(studentObj);
    });
    return this.newTableData;
  }

  getScoreByTopicsData(assessment, instentiateTable: boolean): void {
    this.userService.getStudentTopicsChart(assessment.id).subscribe(studentsList => {
      if (instentiateTable) {
        this.studentsListTable = studentsList;
      }
      this.displayedColumns = this.displayedColumns.concat(this.getTableColumns(studentsList, assessment.title));
      this.studentsDataSource = new MatTableDataSource(this.getTableData(studentsList));
    });
  }

}
