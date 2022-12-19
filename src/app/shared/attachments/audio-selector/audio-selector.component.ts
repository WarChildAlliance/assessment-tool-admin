import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-audio-selector',
  templateUrl: './audio-selector.component.html',
  styleUrls: ['./audio-selector.component.scss']
})
export class AudioSelectorComponent implements OnInit {
  @Input() isRecorderEnabled: boolean;
  @Input() reset$: Observable<void> = null;
  @Input() audioAttachment;
  @Input() isIcon = false;

  @Output() newAudioEvent = new EventEmitter<File>();

  public recorderResetSubject$ = new Subject<void>();
  public showMenu = false;

  constructor() { }

  ngOnInit(): void {
    if (this.reset$) {
      this.reset$.subscribe((_) => {
        this.audioAttachment = null;
        this.recorderResetSubject$.next();
      });
    }
  }

  public handleFileInput(event): void {
    this.audioAttachment = event.target.files[0];
    this.newAudioEvent.emit(this.audioAttachment);
  }

  public onNewAudioRecordingEvent(event): void {
    const name = 'recording_' + new Date().toISOString() + '.wav';
    this.audioAttachment = this.blobToFile(event, name);
    this.newAudioEvent.emit(this.audioAttachment);
  }

  public deleteFile(): void {
    this.audioAttachment = null;
    this.newAudioEvent.emit(null);
  }

  private blobToFile = (theBlob: Blob, fileName: string): File => new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
  });
}
