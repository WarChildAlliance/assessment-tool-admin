import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
})
export class ConfirmModalModule {}
