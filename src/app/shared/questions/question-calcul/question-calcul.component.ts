import { Component, Input, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-question-calcul',
  templateUrl: './question-calcul.component.html',
  styleUrls: ['./question-calcul.component.scss']
})
export class QuestionCalculComponent implements OnInit {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;

  public operatorSymbol: string;
  public answerNumber: number;
  public imageAttachment = null;
  public audioAttachment = null;

  public operatorTypes = [
    { id: 'ADDITION', symbol: '+' },
    { id: 'SUBTRACTION', symbol: '-' },
    { id: 'DIVISION', symbol: '÷' },
    { id: 'MULTIPLICATION', symbol: '×' }
  ];

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.setAttachments();
    if (this.question) {
      const operator = this.operatorTypes.find(op => op.id === this.question.operator);
      this.operatorSymbol = operator?.symbol;
      if (operator.id === 'ADDITION') {
        this.answerNumber = this.question.first_value + this.question.second_value;
      } else if (operator.id === 'SUBTRACTION') {
        this.answerNumber = this.question.first_value - this.question.second_value;
      } else if (operator.id === 'DIVISION') {
        this.answerNumber = this.question.first_value / this.question.second_value;
      } else {
        this.answerNumber = this.question.first_value * this.question.second_value;
      }
    }
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

  private setAttachments(): void {
    this.imageAttachment = this.question.attachments.find(i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find(a => a.attachment_type === 'AUDIO');
  }
}
