import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-answers-overview',
  templateUrl: './answers-overview.component.html',
  styleUrls: ['./answers-overview.component.scss']
})
export class AnswersOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onTopicSelection(ids): void {
    console.log('ids', ids);
  }

}
