import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Group } from 'src/app/core/models/group.model';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { UserService } from 'src/app/core/services/user.service';
import { GroupDialogComponent } from '../group-dialog/group-dialog.component';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {

  public group: Group;
  public groupName = '';

  public displayedColumns: TableColumn[] = [
    { key: 'full_name', name: 'general.studentName' },
    { key: 'username', name: 'students.studentCode', type: 'copy' },
    { key: 'language_name', name: 'general.language' },
    { key: 'country_name', name: 'general.country' }
  ];

  public studentsDataSource: MatTableDataSource<StudentTableData>
    = new MatTableDataSource([]);

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getGroupDetails(params.groupId);
      this.getStudents(params.groupId);
    });
  }

  private getGroupDetails(groupId: string): void {
    this.userService.getGroupById(groupId).subscribe(details => {
      this.groupName = details.name;
      this.group = details;
    });
  }

  private getStudents(groupId: string): void {
    const filteringParams = {
      ordering: '-id',
      group: groupId
    };

    this.userService.getStudentsList(filteringParams).subscribe(students => {
      this.studentsDataSource = new MatTableDataSource(students);
    });
  }

  public onEdit(): void {
    const editGroupDialog = this.dialog.open(GroupDialogComponent, {
      data: {
        group: this.group
      }
    });

    editGroupDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getGroupDetails(this.group.id.toString());
      }
    });
  }

  public onOpenDetails(id: string): void {
    this.router.navigate([`/students/${id}`]);
  }
}
