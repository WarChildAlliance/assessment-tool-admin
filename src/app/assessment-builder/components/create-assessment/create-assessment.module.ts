import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssessmentComponent } from './create-assessment.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CreateAssessmentComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class CreateAssessmentModule { }
