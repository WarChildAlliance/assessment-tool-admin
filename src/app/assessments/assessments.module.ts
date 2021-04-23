import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsRoutingModule } from './assessments-routing.module';
import { AssessmentsComponent } from './assessments.component';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { QuestionDetailComponent } from './question-detail/question-detail.component';


@NgModule({
  declarations: [
    AssessmentsComponent,
    AssessmentDetailComponent,
    QuestionsListComponent,
    QuestionDetailComponent
  ],
  imports: [
    CommonModule,
    AssessmentsRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    SharedModule
  ]
})
export class AssessmentsModule { }
