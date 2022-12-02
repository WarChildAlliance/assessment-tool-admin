import { Component, Input, OnInit} from '@angular/core';
import { Subject } from 'rxjs';

interface Option {
  key: string | number;
  value: string;
}
@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class ChipListComponent implements OnInit {
  @Input() options: Option[];
  @Input() key: string;
  @Input() applySelectFilters: (key: string | number, value: any) => void;
  @Input() filterReset$: Subject<void>;

  public checkedId: string = null;

  constructor() { }

  ngOnInit(): void {
    this.filterReset$.subscribe(() => {
      this.checkedId = null;
    });
  }

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
