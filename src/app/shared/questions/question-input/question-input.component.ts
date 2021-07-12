import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-input',
  templateUrl: './question-input.component.html',
  styleUrls: ['./question-input.component.scss']
})
export class QuestionInputComponent implements OnInit {

  @Input() question;
  @Input() answer;
  @Input() evaluated;

  constructor() { }

  ngOnInit(): void {
  }

}
