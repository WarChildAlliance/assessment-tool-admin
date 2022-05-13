import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-sort',
  templateUrl: './question-sort.component.html',
  styleUrls: ['./question-sort.component.scss']
})
export class QuestionSortComponent implements OnInit {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;

  constructor() { }

  ngOnInit(): void {
  }

}
