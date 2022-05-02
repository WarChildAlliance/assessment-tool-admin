import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-input',
  templateUrl: './question-input.component.html',
  styleUrls: ['./question-input.component.scss']
})
export class QuestionInputComponent implements OnInit {

  @Input() question;
  @Input() answer;
  @Input() evaluated;
  @Input() index;

  public imageAttachment = null;
  public audioAttachment = null;

  constructor() { }

  ngOnInit(): void {
    this.setAttachments();
  }

  setAttachments(): void{
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }

  getSource(path: string): string {
    return (path.slice(0, 5) === 'http:') ? path : environment.API_URL + path;
  }

  playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

}
