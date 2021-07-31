import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


interface DialogData {
  confirmationText: string;
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {


  public confirmationText = 'Are you sure?';



  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data.confirmationText) {
        this.confirmationText = data.confirmationText;
    }
  }

  ngOnInit(): void {}

  cancelAction(): boolean {
    return false;
  }

  confirmAction(): boolean {
    return true;
  }

}
