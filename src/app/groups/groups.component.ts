import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from '../core/models/table-column.model';
import { UserService } from '../core/services/user.service';
import { GroupTableData, GroupSubMenuTableData, GroupActionsButtonsTableData } from '../core/models/group-table-data.model';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { AlertService } from '../core/services/alert.service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { QuestionSetAccessesBuilderComponent } from '../shared/question-set-accesses-builder/question-set-accesses-builder.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  public selectedGroups = [];
  public groupsList = [];
  public scoreListLength: number;
  public buttons = GroupActionsButtonsTableData;

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'general.group' },
    { key: 'students_count', name: 'groups.numberStudents' },
    { key: 'assessments_average', name: 'general.assessments', type: 'score-list' },
    { key: 'average', name: 'general.average', type: 'score' },
    { key: 'questions_count', name: 'groups.amountTasks' },
    { key: 'speed', name: 'general.speed', type: 'duration' },
    { key: 'honey', name: 'general.honey', type: 'customized-icon', icon: 'assets/icons/honey-pot.svg' },
    { key: 'subMenu', name: ' ', type: 'menu' }
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

  public onSelectionChange(newSelection: any[]): void {
    this.selectedGroups = newSelection;
  }

  public onCreate(): void {
    const createGroupDialog = this.dialog.open(GroupDialogComponent, {
      data: { groupsList: this.groupsList }
    });
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

  public onOpenDetails(groupId?: string): void {
    const id = groupId ?? this.selectedGroups[0].id;
    this.router.navigate(
      [`/groups/${id}`]
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

  public subMenuAction(selected: any): void {
    this.selectedGroups = [selected.element];
    this[selected.action]();
  }

  public actionButton(action: any): void {
    this[action]();
  }

  public onAssignAssessment(): void {
    const groupsList = this.selectedGroups.map(group => group.id);
    this.dialog.open(QuestionSetAccessesBuilderComponent, {
      data: { groupsList }
    });
  }

  public onCompare(): void {
    console.log('Compare');
  }

  private getGroups(): void {
    this.userService.getGroupsDetails().subscribe(groups => {
      const tableData = [];
      this.groupsList = groups;

      this.scoreListLength = Math.max(
        ...groups.map(group => group.assessments_average?.length).filter(group => group != null)
      );

      groups.forEach(group => {
        tableData.push({ ...group, subMenu: GroupSubMenuTableData });
      });

      this.groupsDataSource = new MatTableDataSource(tableData);
    });
  }
}
