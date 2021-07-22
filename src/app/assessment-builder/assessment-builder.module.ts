import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentBuilderRoutingModule } from './assessment-builder-routing.module';
import { AssessmentBuilderComponent } from './assessment-builder.component';
import { MatIconModule } from '@angular/material/icon';
import { CreateAssessmentComponent } from './components/create-assessment/create-assessment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateTopicComponent } from './components/create-topic/create-topic.component';
import { CreateQuestionComponent } from './components/create-question/create-question.component';
import { InputComponent } from './components/create-question/components/input/input.component';
import { SelectComponent } from './components/create-question/components/select/select.component';
import { NumberLineComponent } from './components/create-question/components/number-line/number-line.component';
import { SortComponent } from './components/create-question/components/sort/sort.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SelectOptionComponent } from './components/create-question/components/select/components/select-option/select-option.component';
import { SortOptionComponent } from './components/create-question/components/sort/components/sort-option/sort-option.component';



@NgModule({
  declarations: [
    AssessmentBuilderComponent,
    CreateAssessmentComponent,
    CreateTopicComponent,
    CreateQuestionComponent,
    InputComponent,
    SelectComponent,
    NumberLineComponent,
    SortComponent,
    SelectOptionComponent,
    SortOptionComponent
  ],
  imports: [
    CommonModule,
    AssessmentBuilderRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule
  ]
})
export class AssessmentBuilderModule { }
