import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  public imageAttachment = null;
  public audioAttachment = null;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setAttachments();
  }

  private setAttachments(): void{
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }

  getSource(path: string): string {
    // TODO find out why we get two different paths here!
    return (path.slice(0, 5) === 'http:') ? path : environment.API_URL + path;
  }

  playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

}
