import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { SelectAssessmentComponent } from './select-assessment/select-assessment.component';
import { QuestionSelectComponent } from './questions/question-select/question-select.component';
import { QuestionInputComponent } from './questions/question-input/question-input.component';
import { QuestionSortComponent } from './questions/question-sort/question-sort.component';
import { QuestionNumberlineComponent } from './questions/question-numberline/question-numberline.component';


@NgModule({
  declarations: [
    TableComponent,
    SelectAssessmentComponent,
    QuestionSelectComponent,
    QuestionInputComponent,
    QuestionSortComponent,
    QuestionNumberlineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatRadioModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    ClipboardModule,
    TranslateModule,
  ],
  exports: [TableComponent,
    QuestionSelectComponent,
    SelectAssessmentComponent,
    QuestionInputComponent,
    QuestionSortComponent,
    QuestionNumberlineComponent,
    TranslateModule,
  ]
})

export class SharedModule { }
