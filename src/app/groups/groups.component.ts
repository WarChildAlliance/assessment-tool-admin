import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from '../core/models/table-column.model';
import { UserService } from '../core/services/user.service';
import { GroupTableData } from '../core/models/group-table-data.model';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'groups.groupName' },
    { key: 'number_students', name: 'groups.numberStudents' }
  ];

  public groupsDataSource: MatTableDataSource<GroupTableData> =
    new MatTableDataSource([]);

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
   }

  ngOnInit(): void {
    this.getGroups();
  }

  private getGroups(): void {
    this.userService.getGroups().subscribe(groups => {
      const tableData = [];

      groups.forEach(group => {
        tableData.push({ id: group.id, name: group.name, number_students: group.students.length });
      });

      this.groupsDataSource = new MatTableDataSource(tableData);
    });
  }

  public onCreate(): void {
    const createGroupDialog = this.dialog.open(GroupDialogComponent);
    createGroupDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getGroups();
      }
    });
  }

  public onOpenDetails(groupId: string): void {
    this.router.navigate(
      [`/groups/${groupId}`]
    );
  }
}
