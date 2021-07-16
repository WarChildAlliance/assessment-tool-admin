import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-numberline',
  templateUrl: './question-numberline.component.html',
  styleUrls: ['./question-numberline.component.scss']
})
export class QuestionNumberlineComponent implements OnInit {

  @Input() question;
  @Input() answer;
  @Input() evaluated;

  constructor() { }

  ngOnInit(): void {
  }

}
