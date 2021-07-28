import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsAnswersComponent } from './assessments-answers/assessments-answers.component';
import { TopicsListAnswersComponent } from './topics-list-answers/topics-list-answers.component';
import { QuestionsListAnswersComponent } from './questions-list-answers/questions-list-answers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionDetailAnswersComponent } from './question-detail-answers/question-detail-answers.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AssessmentsAnswersComponent,
    TopicsListAnswersComponent,
    QuestionsListAnswersComponent,
    QuestionDetailAnswersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule
  ],
  exports: [
    AssessmentsAnswersComponent
  ]
})
export class AnswersModule { }
