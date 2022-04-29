import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomIconComponent } from './icon.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [CustomIconComponent],
  imports: [CommonModule, MatIconModule],
  exports: [CustomIconComponent],
})
export class CustomIconModule {}
