import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSpinnerComponent } from './spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [CustomSpinnerComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [CustomSpinnerComponent],
})
export class CustomSpinnerModule {}
