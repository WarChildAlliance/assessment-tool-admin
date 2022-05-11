import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {
  @Input() reset$: Observable<void> = null;

  @Output() newImageEvent = new EventEmitter<File>();

  @Input() imageAttachment: File;

  constructor() {}

  ngOnInit(): void {
    if (this.reset$) {
      this.reset$.subscribe((_) => {
        this.imageAttachment = null;
      });
    }
  }

  handleFileInput(event): void {
    this.imageAttachment = event.target.files[0];
    this.newImageEvent.emit(this.imageAttachment);
  }
}
