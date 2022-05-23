import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Group } from 'src/app/core/models/group.model';

interface DialogData {
  group?: Group;
}

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})

export class CreateGroupDialogComponent implements OnInit {
  public group: Group;
  public toEdit = false;
  public supervisorName: string;

  public groupForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    supervisor: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translateService: TranslateService,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getSupervisor();

    if (this.data?.group) {
      this.toEdit = true;
      this.group = this.data.group;

      this.groupForm.patchValue({name: this.group.name});
    }
  }

  private getSupervisor(): void {
    this.userService.getSelf().subscribe(res => {
      this.supervisorName = res.first_name && res.last_name ? res.first_name + ' ' + res.last_name : res.username;
      this.groupForm.patchValue({supervisor: res.id});
    });
  }

  public onSubmit(): void {
    if (this.toEdit) {
      this.editGroup();
    } else {
      this.createNewGroup();
    }
  }

  private createNewGroup(): void {
    const newGroup = {
      name: this.groupForm.value.name,
      supervisor: this.groupForm.value.supervisor
    };

    this.userService.createNewGroup(newGroup).subscribe(
      (group: Group) => {
        this.alertService.success(
          this.translateService.instant('groups.groupCreated')
        );
      },
      error => {
        this.alertService.error(
          this.translateService.instant('groups.errorMessage'), error.message
        );
      }
    );
  }

  private editGroup(): void {
    const newGroup = {
      name: this.groupForm.value.name,
      supervisor: this.groupForm.value.supervisor
    };

    this.userService.editGroup(this.group.id.toString(), newGroup).subscribe(
      (group: Group) => {
        this.alertService.success(
          this.translateService.instant('groups.groupEdited')
        );
      },
      error => {
        this.alertService.error(
          this.translateService.instant('groups.errorMessage'), error.message
        );
      }
    );
  }
}
