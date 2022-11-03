import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-domino',
  templateUrl: './question-domino.component.html',
  styleUrls: ['./question-domino.component.scss']
})
export class QuestionDominoComponent implements OnInit {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;

  public imageAttachment = null;
  public audioAttachment = null;

  constructor() {
  }

  ngOnInit(): void {
    this.setAttachments();
  }

  public getSource(path: string): string {
    return (path.slice(0, 5) === 'http:') ? path : environment.API_URL + path;
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

  public getDotColor(dotNumbers: number): string {
    const colors = [
      '#DD8D77', '#91B393', '#7BA7D8', '#F2B3CC', '#F1D26A', '#AB749F'
    ];
    return colors[dotNumbers - 1];
  }

  private setAttachments(): void {
    this.imageAttachment = this.question.attachments.find(i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find(a => a.attachment_type === 'AUDIO');
  }
}
