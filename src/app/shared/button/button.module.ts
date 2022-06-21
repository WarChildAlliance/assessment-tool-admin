import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './button.component';
import { MatButtonModule } from '@angular/material/button';
import { CustomIconModule } from '../icon/icon.module';
import { CustomSpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [CustomButtonComponent],
  imports: [CommonModule, MatButtonModule, CustomIconModule, CustomSpinnerModule],
  exports: [CustomButtonComponent],
})
export class CustomButtonModule {}
