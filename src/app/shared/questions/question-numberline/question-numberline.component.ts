import { Component, Input, OnChanges } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-question-numberline',
  templateUrl: './question-numberline.component.html',
  styleUrls: ['./question-numberline.component.scss']
})
export class QuestionNumberlineComponent implements OnChanges {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;

  public numberlineItems: number[];
  public imageAttachment = null;
  public audioAttachment = null;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnChanges(): void {
    this.setAttachments();
    this.setQuestionItems();
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

  public getNumberColor(value: number): string {
    const numberColors = [
      '#8D6B91', '#00A3DA', '#47BBBA', '#33AC7D', '#73B932', '#25983C',
      '#F89F04', '#EC6F1B', '#CC0E2F', '#B9358B'
    ];
    return numberColors[Math.abs(value / this.question.step) % numberColors.length];
  }

  private setQuestionItems(): void {
    this.numberlineItems = [];
    for (let i = this.question.start; i <= this.question.end; i += this.question.step) {
      this.numberlineItems.push(i);
    }
  }

  private setAttachments(): void{
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }
}
