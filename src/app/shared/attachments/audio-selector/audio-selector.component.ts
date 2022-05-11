import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-audio-selector',
  templateUrl: './audio-selector.component.html',
  styleUrls: ['./audio-selector.component.scss']
})
export class AudioSelectorComponent implements OnInit {
  @Input() recorderEnabled: boolean;
  @Input() reset$: Observable<void> = null;

  @Output() newAudioEvent = new EventEmitter<File>();

  @Input() audioAttachment;
  public recorderResetSubject$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    if (this.reset$) {
      this.reset$.subscribe((_) => {
        this.audioAttachment = null;
        this.recorderResetSubject$.next();
      });
    }
  }

  private blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
  }

  handleFileInput(event): void {
    this.audioAttachment = event.target.files[0];
    this.newAudioEvent.emit(this.audioAttachment);
  }

  addRecordedAudio(event): void {
    const name = 'recording_' + new Date().toISOString() + '.wav';
    this.audioAttachment = this.blobToFile(event, name);
    this.newAudioEvent.emit(this.audioAttachment);
  }
}
