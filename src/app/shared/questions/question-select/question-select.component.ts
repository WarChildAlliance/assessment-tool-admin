import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-select',
  templateUrl: './question-select.component.html',
  styleUrls: ['./question-select.component.scss']
})
export class QuestionSelectComponent implements OnInit {

  @Input() question;
  @Input() answer;
  @Input() evaluated;

  constructor() { }

  ngOnInit(): void {
  }

  setAnswerBackground(option: any): string {
    return option.valid ? '#7EBF9A' : '';
}

}
