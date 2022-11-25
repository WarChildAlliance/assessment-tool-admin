import { Component, Input } from '@angular/core';

interface Option {
  key: string | number;
  value: string;
}
@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent {
  @Input() options: Option[];
  @Input() key: string;
  @Input() applySelectFilters: (key: string | number, value: any) => void;

  public checkedId: string = null;

  constructor() { }

  applyFilterSelectionChange(event: any, key: string | number, value: any): void {
    if (event.target.id === this.checkedId) {
      this.applySelectFilters(key, '');
      this.checkedId = null;
      return;
    }
    this.checkedId = event.target.id;
    this.applySelectFilters(key, value);
  }
}
