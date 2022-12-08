import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AssessmentDashboard } from 'src/app/core/models/assessment-dashboard.model';
import { UserService } from 'src/app/core/services/user.service';
import { Group } from 'src/app/core/models/group.model';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-by-question-set-table',
  templateUrl: './score-by-question-set-table.component.html',
  styleUrls: ['./score-by-question-set-table.component.scss']
})
export class ScoreByQuestionSetTableComponent implements OnInit {

  public studentsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: any[] = [
    { key: 'full_name', name: 'general.student'}
  ];

  public newTableData = [];

  public isAssessmentSelected = false;

  public scoreByQuestionSetTable = [];

  public hasData = true;
  public loading = true;

  private selectedAssessments: AssessmentDashboard[] = [];

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

  public selectTableAssessment(assessment: AssessmentDashboard): void {
    this.loading = true;

    if (!this.scoreByQuestionSetTable.length) {
      this.selectedAssessments.push(assessment);
      this.getScoreByQuestionSetsData(assessment, true);
    } else {
      const matchingCol = this.displayedColumns.find(val => val.assmnt === assessment.title);
      if (!matchingCol) {
        this.selectedAssessments.push(assessment);
        this.getScoreByQuestionSetsData(assessment, false);
      } else {
        this.selectedAssessments.splice(this.selectedAssessments.indexOf(assessment), 1);
        this.displayedColumns = this.displayedColumns.filter(col => col.assmnt !== assessment.title);
        this.newTableData.forEach(data => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              assessment.question_sets.forEach(questionSet => {
                if (questionSet.name.toLocaleLowerCase() === key) {
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
      this.getScoreByQuestionSetsData(assessment, false, groupIds);
    }
  }

  private getTableColumns(studentsList, assessmentTitle): any[]{
    const tableColumns = [];
    studentsList[0].question_sets.forEach(el => {
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
      const studentObj = this.scoreByQuestionSetTable.find(val => val.full_name === assessmentData.full_name);
      assessmentData.question_sets.forEach(questionSet => {
        studentObj[Object.keys(questionSet)[0].toLocaleLowerCase()] = Object.values(questionSet)[0];
      });
      this.newTableData.push(studentObj);
    });
    return this.newTableData;
  }

  private getScoreByQuestionSetsData(assessment, instentiateTable: boolean, selectedGroupsIds: number[] = []): void {
    if (assessment && assessment.id){
      this.userService.getStudentQuestionSetsChart(assessment.id).subscribe(scoreByQuestionSet => {
        if (selectedGroupsIds.length) {
          scoreByQuestionSet = scoreByQuestionSet.filter(el => {
            const groups = el.group as Group[];
            let hasSelectedGroup = false;

            groups.map(group => {
              hasSelectedGroup = selectedGroupsIds.includes(group.id);
            });

            return hasSelectedGroup;
          });
        }
        if (scoreByQuestionSet.length) {
          if (instentiateTable) {
            this.scoreByQuestionSetTable = scoreByQuestionSet;
          }
          this.displayedColumns = this.displayedColumns.concat(this.getTableColumns(scoreByQuestionSet, assessment.title));
          this.studentsDataSource = new MatTableDataSource(this.getTableData(scoreByQuestionSet));
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
}
