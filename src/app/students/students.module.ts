import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from 'src/app/shared/shared.module';
import { AnswersModule } from '../answers/answers.module';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { CustomButtonModule } from '../shared/button/button.module';
import { QuestionSetAccessModalComponent } from './question-set-access-modal/question-set-access-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PreviousButtonModule } from '../shared/previous-button/previous-button.module';
import { GroupDialogModule } from '../groups/group-dialog/group-dialog.module';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentDetailComponent,
    StudentDialogComponent,
    QuestionSetAccessModalComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AnswersModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSortModule,
    MatDividerModule,
    SharedModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatExpansionModule,
    CustomButtonModule,
    MatTooltipModule,
    PreviousButtonModule,
    GroupDialogModule
  ],
})
export class StudentsModule { }
