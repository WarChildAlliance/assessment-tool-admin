import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { LibraryRoutingModule } from './library-routing.module';
import { CustomButtonModule } from '../shared/button/button.module';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { AssessmentBuilderModule } from '../assessment-builder/assessment-builder.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    LibraryComponent
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    CustomButtonModule,
    SharedModule,
    MatCardModule,
    AssessmentBuilderModule,
    MatFormFieldModule,
    MatSelectModule,
  ]
})
export class LibraryModule { }
