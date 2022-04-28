import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';
import { CustomIconModule } from '../icon/icon.module';

@NgModule({
  declarations: [CustomButtonComponent],
  imports: [CommonModule, MatButtonModule, CustomIconModule],
  exports: [CustomButtonComponent],
})
export class CustomButtonModule {}
