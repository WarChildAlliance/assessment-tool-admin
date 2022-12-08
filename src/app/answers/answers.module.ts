import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsAnswersComponent } from './assessments-answers/assessments-answers.component';
import { QuestionSetsListAnswersComponent } from './question-sets-list-answers/question-sets-list-answers.component';
import { QuestionsListAnswersComponent } from './questions-list-answers/questions-list-answers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionDetailAnswersComponent } from './question-detail-answers/question-detail-answers.component';
import { MatIconModule } from '@angular/material/icon';
import { PreviousButtonModule } from '../shared/previous-button/previous-button.module';


@NgModule({
  declarations: [
    AssessmentsAnswersComponent,
    QuestionSetsListAnswersComponent,
    QuestionsListAnswersComponent,
    QuestionDetailAnswersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    PreviousButtonModule
  ],
  exports: [
    AssessmentsAnswersComponent
  ]
})
export class AnswersModule { }
