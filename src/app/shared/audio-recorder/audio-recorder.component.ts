import { Component, Input, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})

export class AudioRecorderComponent implements OnInit {

  @Input() reset$: Observable<void>;

  @Output() newAudioRecordingEvent = new EventEmitter<string>();

  public isRecording = false;
  public recordingUrl: string;
  public errorMessage: string;


  private title = 'micRecorder';
  private recorder: RecordRTC.StereoAudioRecorder;
  private stream: MediaStream;

  constructor(
    private domSanitizer: DomSanitizer,
    private translateService: TranslateService
    ) {}

  ngOnInit(): void {
    this.reset$.subscribe((_) => {
      this.recordingUrl = undefined;
    });
  }

  public sanitizeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  public initiateRecording(): void {
    this.isRecording = true;
    const mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(
      this.recordingSuccessCallback.bind(this),
      this.recordingErrorCallback.bind(this)
    );
  }

  public stopRecording(): void {
    this.isRecording = false;
    this.recorder.stop(this.processRecording.bind(this));
    this.stream.getTracks().forEach(track => track.stop());
  }

  private processRecording(blob): void {
    this.recordingUrl = URL.createObjectURL(blob);
    this.newAudioRecordingEvent.emit(blob);
  }

  private recordingSuccessCallback(stream): void {
    const options = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      sampleRate: 48000,
    };
    const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;

    this.stream = stream;
    this.recorder = new StereoAudioRecorder(stream, options);
    this.recorder.record();
  }

  private recordingErrorCallback(error): void {
    this.errorMessage = this.translateService.instant('assessmentBuilder.questions.errorAudio');
  }
}

