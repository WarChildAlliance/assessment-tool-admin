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
import { MatCardModule } from '@angular/material/card';
import { SetOfQuestionsRoutingModule } from './set-of-questions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomButtonModule } from 'src/app/shared/button/button.module';
import { SetOfQuestionsComponent } from './set-of-questions.component';

@NgModule({
  declarations: [
    SetOfQuestionsComponent
  ],
  imports: [
    CommonModule,
    SetOfQuestionsRoutingModule,
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
    CustomButtonModule
  ]
})
export class SetOfQuestionsModule { }
