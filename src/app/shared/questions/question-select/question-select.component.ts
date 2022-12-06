import { Component, Input, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-question-select',
  templateUrl: './question-select.component.html',
  styleUrls: ['./question-select.component.scss']
})
export class QuestionSelectComponent implements OnInit {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;

  public imageAttachment = null;
  public audioAttachment = null;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }

  public getAnswerBackgroundStyle(option: any): string {
    if (this.answer) {
      if (option.id === this.answer.selected_option) {
        return 'student';
      }
      return  option.valid ? 'valid' : '';
    }
    return option.valid ? 'valid' : 'invalid';
  }

  public hasImageAttached(option): boolean {
    return option.attachments.some((attachment) => attachment.attachment_type === 'IMAGE');
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

}
