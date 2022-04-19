import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { AssessmentsRoutingModule } from './assessments-routing.module';
import { AssessmentsComponent } from './assessments.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { MatCardModule } from '@angular/material/card';

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
    SharedModule,
    MatCardModule,
  ]
})
export class AssessmentsModule { }
