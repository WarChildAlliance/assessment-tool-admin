import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssessmentBuilderRoutingModule } from './assessment-builder-routing.module';
import { AssessmentBuilderComponent } from './assessment-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TopicFormDialogComponent } from './topic-form-dialog/topic-form-dialog.component';
import { AssessmentSummaryComponent } from './assessment-summary/assessment-summary.component';
import { AssessmentFormDialogComponent } from './assessment-form-dialog/assessment-form-dialog.component';
import { TopicDetailsComponent } from './topic-details/topic-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionInputFormComponent } from './questions/question-input-form/question-input-form.component';
import { QuestionNumberlineFormComponent } from './questions/question-numberline-form/question-numberline-form.component';
import { QuestionSelectFormComponent } from './questions/question-select-form/question-select-form.component';
import { MatDividerModule } from '@angular/material/divider';
import { AudioRecorderComponent } from '../shared/audio-recorder/audio-recorder.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomButtonModule } from '../shared/button/button.module';
import { HorizontalScrollArrowsComponent } from '../shared/horizontal-scroll-arrows/horizontal-scroll-arrows.component';
import { ImageSelectorComponent } from '../shared/attachments/image-selector/image-selector.component';
import { AudioSelectorComponent } from '../shared/attachments/audio-selector/audio-selector.component';
import { PreviousButtonModule } from '../shared/previous-button/previous-button.module';
import { QuestionDragAndDropFormComponent } from './questions/question-drag-and-drop-form/question-drag-and-drop-form.component';
import { AreaSelectorComponent } from './questions/area-selector/area-selector.component';

@NgModule({
  declarations: [
    AssessmentBuilderComponent,
    TopicFormDialogComponent,
    AssessmentSummaryComponent,
    AssessmentFormDialogComponent,
    TopicDetailsComponent,
    QuestionInputFormComponent,
    QuestionNumberlineFormComponent,
    QuestionSelectFormComponent,
    AudioRecorderComponent,
    HorizontalScrollArrowsComponent,
    ImageSelectorComponent,
    AudioSelectorComponent,
    QuestionDragAndDropFormComponent,
    AreaSelectorComponent
  ],
  imports: [
    CommonModule,
    AssessmentBuilderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    SharedModule,
    MatDividerModule,
    MatTooltipModule,
    CustomButtonModule,
    PreviousButtonModule
  ]
})
export class AssessmentBuilderModule { }
