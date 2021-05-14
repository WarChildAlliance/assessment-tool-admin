import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsAnswersComponent } from './sessions-answers/sessions-answers.component';
import { AssessmentsAnswersComponent } from './assessments-answers/assessments-answers.component';
import { TopicsListAnswersComponent } from './topics-list-answers/topics-list-answers.component';
import { QuestionsListAnswersComponent } from './questions-list-answers/questions-list-answers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionDetailAnswersComponent } from './question-detail-answers/question-detail-answers.component';


@NgModule({
  declarations: [
    SessionsAnswersComponent,
    AssessmentsAnswersComponent,
    TopicsListAnswersComponent,
    QuestionsListAnswersComponent,
    QuestionDetailAnswersComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AssessmentsAnswersComponent,
    SessionsAnswersComponent
  ]
})
export class AnswersModule { }
