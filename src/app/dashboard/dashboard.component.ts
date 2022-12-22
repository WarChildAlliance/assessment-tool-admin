import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GroupTableData } from '../core/models/group-table-data.model';
import { TableColumn } from '../core/models/table-column.model';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public selectedGroups = [];
  public scoreListLength: number;

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'general.groups' },
    { key: 'students_count', name: 'general.students' },
    { key: 'assessments_average', name: 'general.assessments', type: 'score-list' },
    { key: 'average', name: 'general.average', type: 'score' },
    { key: 'speed', name: 'dashboard.averageSpeed', type: 'duration' },
    { key: 'questions_count', name: 'groups.amountTasks' },
    { key: 'navigate_to', name: ' ', type: 'navigate' }
  ];

  public legend = [
    {name: '< 40%', value: 39},
    {name: '41 - 70%', value: 41},
    {name: '71 - 94 %', value: 71},
    {name: '> 95%', value: 100}
  ];

  public studentsPageInfo = [
    {name: 'checkSel', icon: 'SEL_faces_aLotLikeMe'},
    {name: 'checkScore', icon: 'score'},
    {name: 'checkHoneypot', icon: 'set-honeypots'}
  ];

  public groupsDataSource: MatTableDataSource<GroupTableData> =
    new MatTableDataSource([]);

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
    this.getGroups();
  }

  public redirectToPage(page: string): void {
    this.router.navigate([page]);
  }

  private getGroups(): void {
    this.userService.getGroupsDetails().subscribe(groups => {
      // take only 4 groups
      const tableData = groups.slice(0, 4);

      this.scoreListLength = Math.max(
        ...tableData.map(group => group.assessments_average?.length).filter(group => group != null)
      );

      tableData.forEach(group => {
        group.navigate_to = `groups/${group.id}`;
      });

      this.groupsDataSource = new MatTableDataSource(tableData);
    });
  }
}
