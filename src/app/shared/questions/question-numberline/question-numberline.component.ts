import { Component, Input, OnChanges } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

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
  @Input() preview = false;

  public numberlineItems: number[];
  public imageAttachment = null;
  public audioAttachment = null;
  public imagePreview = null;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnChanges(): void {
    this.setAttachments();
    this.setQuestionItems();
    if (this.preview) {
      this.onPreviewQuestion();
    }
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

  public getNumberColor(value: number): string {
    const numberColors = [
      '#8D6B91', '#00A3DA', '#47BBBA', '#33AC7D', '#73B932', '#25983C',
      '#F89F04', '#EC6F1B', '#CC0E2F', '#B9358B'
    ];
    return numberColors[Math.abs(value / this.question.step) % numberColors.length];
  }

  private setQuestionItems(): void {
    if (Number.isInteger(this.question.start) && Number.isInteger(this.question.end) && Number.isInteger(this.question.step)) {
      this.numberlineItems = [];
      for (let i = this.question.start; i <= this.question.end; i += this.question.step) {
        this.numberlineItems.push(i);
      }

      if (this.question.shuffle) {
        this.numberlineItems = this.numberlineItems.map(option => ({
          option,
          sort: Math.random()
        })).sort((a, b) => a.sort - b.sort).map(({ option }) => option);
      }
    }
  }

  private setAttachments(): void{
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE');
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
  }

  private onPreviewQuestion(): void {
    this.setAttachments();
    // in preview mode an audio preview isn't available to be played, only the icon is shown
    if (this.imageAttachment) {
      if (!(this.imageAttachment.file instanceof File)) {
        // newFile: When editing the question we got the image url from the backend (not a new file uploaded by the user)
        // so we just need to get the source of the file to show it
        this.question.newFile = false;
      } else {
        this.question.newFile = true;
        this.previewImageAttachment(this.imageAttachment.file);
      }
    }
  }

  private previewImageAttachment(event: any): void {
    // Handle File Select
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(event);
  }

  private handleReaderLoaded(readerEvt: any): void {
    const binaryString = readerEvt.target.result;
    this.imagePreview = 'data:image/jpg;base64,' + btoa(binaryString);
  }
}
