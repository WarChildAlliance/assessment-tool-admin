import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-question-select',
  templateUrl: './question-select.component.html',
  styleUrls: ['./question-select.component.scss']
})
export class QuestionSelectComponent implements OnInit, OnChanges {

  @Input() question: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;
  @Input() preview = false;

  public imageAttachment = null;
  public audioAttachment = null;
  public imagePreview = null;

  private type: string;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.imageAttachment = this.question.attachments.find(i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find(a => a.attachment_type === 'AUDIO');

    if (this.preview) {
      this.onPreviewQuestion();
    }
  }

  ngOnChanges(): void {
    if (this.preview) {
      this.onPreviewQuestion();
    }
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
    return option.attachments?.some((attachment) => attachment.attachment_type === 'IMAGE');
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

  private onPreviewQuestion(): void {
    // in preview mode an audio preview isn't available to be played, only the icon is shown
    this.audioAttachment = this.question.attachments.find(a => a.attachment_type === 'AUDIO');
    this.imageAttachment = this.question.attachments.find(i => i.attachment_type === 'IMAGE');

    if (this.imageAttachment) {
      if (!(this.imageAttachment.file instanceof File)) {
        // newFile: When editing the question we got the image url from the backend (not a new file uploaded by the user)
        // so we just need to get the source of the file to show it
        this.question.newFile = false;
      } else {
        this.question.newFile = true;
        this.type = 'imageAttachment';
        this.previewImageAttachment(this.imageAttachment.file);
      }
    }

    this.question.options.forEach((option, i) => {
      if (this.hasImageAttached(option)) {
        option.attachments.forEach(att => {
          if (att.attachment_type === 'IMAGE') {
            if (!(att.file instanceof File)) {
              option.newFile = false;
            } else {
              option.newFile = true;
              this.type = i;
              this.previewImageAttachment(att.file);
            }
          }
        });
      }
    });
  }

  private previewImageAttachment(event: any): void {
    // Handle File Select
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(event);
  }

  private handleReaderLoaded(readerEvt: any): void {
    const binaryString = readerEvt.target.result;
    if (this.type === 'imageAttachment') {
      this.imagePreview = 'data:image/jpg;base64,' + btoa(binaryString);
    } else {
      this.question.options[this.type].attachments.forEach((attachment) => {
        if (attachment.attachment_type === 'IMAGE') {
          // Don't save the file uploaded on the attachment.file because
          // it'll be used to save the question and can't be overwritten
          attachment.newFile = 'data:image/jpg;base64,' + btoa(binaryString);
        }
      });
    }
  }
}
