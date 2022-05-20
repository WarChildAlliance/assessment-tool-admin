import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {
  @Input() reset$: Observable<void> = null;
  @Input() imageAttachment: File;

  @Output() newImageEvent = new EventEmitter<File>();


  constructor() {}

  ngOnInit(): void {
    if (this.reset$) {
      this.reset$.subscribe((_) => {
        this.imageAttachment = null;
      });
    }
  }

  public handleFileInput(event): void {
    this.imageAttachment = event.target.files[0];
    this.newImageEvent.emit(this.imageAttachment);
  }
}
