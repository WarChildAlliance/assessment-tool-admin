import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from '../core/models/table-column.model';
import { UserService } from '../core/services/user.service';
import { GroupTableData } from '../core/models/group-table-data.model';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { AlertService } from '../core/services/alert.service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  public selectedGroups = [];

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
    private translateService: TranslateService,
    private alertService: AlertService
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

  public onSelectionChange(newSelection: any[]): void {
    this.selectedGroups = newSelection;
  }

  public onCreate(): void {
    const createGroupDialog = this.dialog.open(GroupDialogComponent);
    createGroupDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getGroups();
      }
    });
  }

  public onEdit(): void {
    const groupId = this.selectedGroups[0].id;

    this.userService.getGroupById(groupId).subscribe(group => {
      const editGroupDialog = this.dialog.open(GroupDialogComponent, {
        data: {
          group
        }
      });

      editGroupDialog.afterClosed().subscribe((value) => {
        if (value) {
          this.getGroups();
        }
      });
    });
  }

  public onOpenDetails(groupId: string): void {
    this.router.navigate(
      [`/groups/${groupId}`]
    );
  }

  public onDelete(): void {
    const groupTranslation = this.translateService.instant(
      this.selectedGroups.length > 1 ? 'general.groups' : 'general.group'
    );
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('general.delete', {
          type: groupTranslation.toLocaleLowerCase()
        }),
        content: this.translateService.instant('groups.deleteGroupPrompt', {
          type: groupTranslation.toLocaleLowerCase()
        }),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res) {
        const toDelete = this.selectedGroups.map(group => group.id.toString());
        const onDeleteCallback = (): void => {
          this.alertService.success(this.translateService.instant('general.deleteSuccess', {
            type: groupTranslation
          }));
          this.getGroups();
        };

        if (toDelete.length === 1) {
          this.userService.deleteGroup(toDelete[0]).subscribe(onDeleteCallback);
          return;
        }
        this.userService.deleteGroups(toDelete).subscribe(onDeleteCallback);
      }
    });
  }
}
