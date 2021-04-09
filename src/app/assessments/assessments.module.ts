import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsRoutingModule } from './assessments-routing.module';
import { AssessmentsComponent } from './assessments.component';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    AssessmentsComponent,
    AssessmentDetailComponent
  ],
  imports: [
    CommonModule,
    AssessmentsRoutingModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class AssessmentsModule { }
