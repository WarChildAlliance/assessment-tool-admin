import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-sort',
  templateUrl: './question-sort.component.html',
  styleUrls: ['./question-sort.component.scss']
})
export class QuestionSortComponent {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;

  constructor() { }
}
