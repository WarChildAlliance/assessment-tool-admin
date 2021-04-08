import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsRoutingModule } from './assessments-routing.module';
import { AssessmentsComponent } from './assessments.component';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';



@NgModule({
  declarations: [
    AssessmentsComponent,
    AssessmentDetailComponent
  ],
  imports: [
    CommonModule,
    AssessmentsRoutingModule
  ]
})
export class AssessmentsModule { }
