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
import { QuestionDragAndDropComponent } from './questions/question-drag-and-drop/question-drag-and-drop.component';
import { MatDividerModule } from '@angular/material/divider';
import { HorizontalScrollArrowsComponent } from './horizontal-scroll-arrows/horizontal-scroll-arrows.component';
import { CustomButtonModule } from './button/button.module';
import { QuestionSelComponent } from './questions/question-sel/question-sel.component';
import { QuestionDominoComponent } from './questions/question-domino/question-domino.component';
import { QuestionCalculComponent } from './questions/question-calcul/question-calcul.component';
import { ShapesComponent } from './questions/shapes/shapes.component';

@NgModule({
  declarations: [
    TableComponent,
    SelectAssessmentComponent,
    QuestionSelectComponent,
    QuestionInputComponent,
    QuestionSortComponent,
    QuestionNumberlineComponent,
    QuestionDragAndDropComponent,
    HorizontalScrollArrowsComponent,
    QuestionSelComponent,
    QuestionDominoComponent,
    QuestionCalculComponent,
    ShapesComponent
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
    MatDividerModule,
    CustomButtonModule
  ],
  exports: [
    TableComponent,
    QuestionSelectComponent,
    SelectAssessmentComponent,
    QuestionInputComponent,
    QuestionSortComponent,
    QuestionNumberlineComponent,
    QuestionDragAndDropComponent,
    TranslateModule,
    HorizontalScrollArrowsComponent,
    QuestionSelComponent,
    QuestionDominoComponent,
    QuestionCalculComponent,
    ShapesComponent
  ]
})

export class SharedModule { }
