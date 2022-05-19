import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  title?: string;
  content?: string;
  contentType?: 'text' | 'innerHTML';
  cancelText?: string;
  confirmText?: string;
  confirmColor?: 'warn' | 'primary' | 'accent';
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  public title = 'general.confirm';
  public content = '';
  public contentType = 'text';
  public cancelText = 'general.cancel';
  public confirmText = 'general.confirm';
  public confirmColor = 'primary';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.content) {
      this.content = data.content;
    }
    if (data.contentType) {
      this.contentType = data.contentType;
    }
    if (data.cancelText) {
      this.cancelText = data.cancelText;
    }
    if (data.confirmText) {
      this.confirmText = data.confirmText;
    }
    if (data.confirmColor) {
      this.confirmColor = data.confirmColor;
    }
  }

  ngOnInit(): void {}
}
