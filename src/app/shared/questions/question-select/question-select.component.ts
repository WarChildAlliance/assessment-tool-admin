import { Component, Input, OnInit } from '@angular/core';
import { StudentDetailComponent } from 'src/app/students/student-detail/student-detail.component';
import { environment } from 'src/environments/environment';

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

  constructor() { }

  ngOnInit(): void {
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }

  public getAnswerBackground(option: any): string {
    if (this.answer) {
      if (option.id === this.answer.selected_options[0]) {
        return 'student';
      }
      return  option.valid ? 'valid' : '';
    }
    return option.valid ? 'valid' : 'invalid';
  }

  public hasImageAttached(option): boolean {
    return option.attachments.some((attachment) => attachment.attachment_type === 'IMAGE');
  }

  public getSource(path: string): string {
    return (path.slice(0, 5) === 'http:') ? path : environment.API_URL + path;
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

}
