import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentBuilderRoutingModule } from './assessment-builder-routing.module';
import { AssessmentBuilderComponent } from './assessment-builder.component';
import { MatIconModule } from '@angular/material/icon';
import { CreateAssessmentComponent } from './components/create-assessment/create-assessment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateTopicComponent } from './components/create-topic/create-topic.component';
import { CreateQuestionComponent } from './components/create-question/create-question.component';



@NgModule({
  declarations: [
    AssessmentBuilderComponent,
    CreateAssessmentComponent,
    CreateTopicComponent,
    CreateQuestionComponent
  ],
  imports: [
    CommonModule,
    AssessmentBuilderRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatExpansionModule
  ]
})
export class AssessmentBuilderModule { }
