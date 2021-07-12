import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit {

  currentQuestionType = 'input';

  constructor() { }

  ngOnInit(): void {
  }

  setQuestionDisplay(questionType: string): void{
    this.currentQuestionType = questionType;
  }

}
