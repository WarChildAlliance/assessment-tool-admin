import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Group } from 'src/app/core/models/group.model';

interface DialogData {
  group?: Group;
  groupsList?: Group[];
}

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss']
})

export class GroupDialogComponent implements OnInit {
  public group: Group;
  public groupsList: Group[];
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
      this.group = this.data.group;
      this.groupForm.patchValue({name: this.group.name});
    }
    if (this.data?.groupsList) { this.groupsList = this.data?.groupsList; }

    this.groupForm.controls.name.valueChanges.subscribe(value => {
      const duplicated = this.groupsList.some(group => group.name === value);
      if (duplicated) {
        this.groupForm.controls.name.setErrors({ duplicatedName: true });
      } else {
        this.groupForm.controls.name.setErrors(null);
      }
    });
  }

  public onSubmit(): void {
    const groupToSave = {
      name: this.groupForm.value.name,
      supervisor: this.groupForm.value.supervisor
    };

    const groupService = this.data?.group ? this.userService.editGroup(this.group.id.toString(), groupToSave)
     : this.userService.createNewGroup(groupToSave);
    groupService.subscribe(
      (group: Group) => {
        this.alertService.success(
          this.translateService.instant(this.data?.group ? 'general.editSuccess' : 'general.createSuccess', {
            type: this.translateService.instant('general.group'),
          })
        );
      },
      error => {
        this.alertService.error(
          this.translateService.instant('groups.errorMessage'), error.message
        );
      }
    );
  }

  private getSupervisor(): void {
    this.userService.getSelf().subscribe(res => {
      this.supervisorName = res.first_name && res.last_name ? res.first_name + ' ' + res.last_name : res.username;
      this.groupForm.patchValue({supervisor: res.id});
    });
  }
}
