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

  constructor() { }

  ngOnInit(): void {
  }

  setAnswerBackground(option: any): string {
    return option.valid ? '#7EBF9A' : '';
}

getAnswerBackground(option: any): string {
  return option.valid ? 'valid' : 'invalid';
}

hasImageAttached(option): boolean {
  return option.attachments.some((attachment) => attachment.attachment_type === 'IMAGE');
}

getSource(path: string): string{
  return environment.API_URL + path;
}

playAudio(file){
  console.log('file', file);
  const audio = new Audio(environment.API_URL + file);
  audio.load()
  audio.play()

}

}
