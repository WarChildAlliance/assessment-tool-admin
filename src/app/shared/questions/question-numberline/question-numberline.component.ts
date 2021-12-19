import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-numberline',
  templateUrl: './question-numberline.component.html',
  styleUrls: ['./question-numberline.component.scss']
})
export class QuestionNumberlineComponent implements OnInit {

  @Input() question;
  @Input() answer;
  @Input() evaluated;
  @Input() index;

  public imageAttachment = null;
  public audioAttachment = null;

  constructor() { }

  ngOnInit(): void {
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }

  getSource(path: string): string {
    return environment.API_URL + path;
  }

  playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

}
