import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-sort',
  templateUrl: './question-sort.component.html',
  styleUrls: ['./question-sort.component.scss']
})
export class QuestionSortComponent implements OnInit {

  @Input() question;
  @Input() answer;
  @Input() evaluated;
  @Input() index;

  constructor() { }

  ngOnInit(): void {
  }

}
