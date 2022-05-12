import { Component, Input, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})

export class AudioRecorderComponent implements OnInit {

  // private title = 'micRecorder';
  private record: RecordRTC.StereoAudioRecorder;

  public recording = false;
  public url: string;
  public error: string;

  @Output() audioRecordingEvent = new EventEmitter<string>();

  @Input() reset$: Observable<void>;

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.reset$.subscribe((_) => {
      this.url = undefined;
    });
  }

  sanitize(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  initiateRecording(): void {
    this.recording = true;
    const mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream): void {
    const options = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      sampleRate: 48000,
    };
    const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording(): void {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  processRecording(blob): void {
    this.url = URL.createObjectURL(blob);
    this.audioRecordingEvent.emit(blob);
  }

  errorCallback(error): void {
    this.error = 'Can not play audio in your browser';
  }

}

