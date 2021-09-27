import { Component, Input, OnInit } from '@angular/core';
import { StudentDetailComponent } from 'src/app/students/student-detail/student-detail.component';
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
  }

  getAnswerBackground(option: any): string {
    if (this.answer) {
      if (option.id === this.answer.selected_options[0]) {
        return 'student';
      }
      return  option.valid ? 'valid' : '';
    }
    return option.valid ? 'valid' : 'invalid';

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
