import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-select',
  templateUrl: './question-select.component.html',
  styleUrls: ['./question-select.component.scss']
})
export class QuestionSelectComponent implements OnInit {

  @Input() question;
  @Input() answer;
  @Input() evaluated;
  @Input() index;

  constructor() { }

  ngOnInit(): void {
    console.log('answer', this.answer);
  }

  getAnswerBackground(option: any): string {
    if (this.answer) {
      return option.id === this.answer.selected_options[0] ? 'student' : '';
    } else {
      return option.valid ? 'valid' : 'invalid';
    }
  }

  hasImageAttached(option): boolean {
    return option.attachments.some((attachment) => attachment.attachment_type === 'IMAGE');
  }

  getSource(path: string): string {
    return environment.API_URL + path;
  }

  playAudio(file): void {
    const audio = new Audio(environment.API_URL + file);
    audio.load();
    audio.play();

  }

}
