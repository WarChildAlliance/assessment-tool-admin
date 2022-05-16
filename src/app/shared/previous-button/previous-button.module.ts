import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviousButtonComponent } from './previous-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomButtonModule } from '../button/button.module';

@NgModule({
  declarations: [PreviousButtonComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    CustomButtonModule
  ],
  exports: [PreviousButtonComponent],
})
export class PreviousButtonModule {}
