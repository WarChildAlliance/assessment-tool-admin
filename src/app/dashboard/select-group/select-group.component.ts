import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Group } from 'src/app/core/models/group.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.scss']
})
export class SelectGroupComponent implements OnInit {

  @Input() multiple = false;

  @Output() groupsSelection = new EventEmitter<number[]>();

  public groups: Group[] = [];

  public selectedGroup: Group;
  public selectedGroupArr: Group[] = [];


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getGroups();
  }

  public onSelect(group: Group): void {
    if (this.multiple) {
      this.groupsSelection.emit(this.selectedGroupArr.map(el => el.id));
      return;
    }
    this.groupsSelection.emit([group.id]);
  }

  private getGroups(): void {
    this.userService.getGroups().subscribe(
      (groups: Group[]) => this.groups = groups);
  }
}
