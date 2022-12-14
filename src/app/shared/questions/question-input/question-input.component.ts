import { Component, Input, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-question-input',
  templateUrl: './question-input.component.html',
  styleUrls: ['./question-input.component.scss']
})
export class QuestionInputComponent implements OnInit {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;

  public imageAttachment = null;
  public audioAttachment = null;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.setAttachments();
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

  private setAttachments(): void{
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }
}
