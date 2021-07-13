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
import { InputComponent } from './components/create-question/components/input/input.component';
import { SelectComponent } from './components/create-question/components/select/select.component';
import { NumberLineComponent } from './components/create-question/components/number-line/number-line.component';
import { SortComponent } from './components/create-question/components/sort/sort.component';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    AssessmentBuilderComponent,
    CreateAssessmentComponent,
    CreateTopicComponent,
    CreateQuestionComponent,
    InputComponent,
    SelectComponent,
    NumberLineComponent,
    SortComponent
  ],
  imports: [
    CommonModule,
    AssessmentBuilderRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatCardModule
  ]
})
export class AssessmentBuilderModule { }
