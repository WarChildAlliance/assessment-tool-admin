import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-sel',
  templateUrl: './question-sel.component.html',
  styleUrls: ['./question-sel.component.scss']
})
export class QuestionSelComponent implements OnInit {

  @Input() question: any;
  @Input() answer: any;
  @Input() index: number;

  public selOptions = [
    {id: 'NOT_REALLY', path: 'notReallyLikeMe'},
    {id: 'A_LITTLE', path: 'aLittleLikeMe'},
    {id: 'A_LOT', path: 'aLotLikeMe'}
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
