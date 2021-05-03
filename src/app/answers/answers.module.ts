import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsAnswersComponent } from './sessions-answers/sessions-answers.component';
import { AssessmentsAnswersComponent } from './assessments-answers/assessments-answers.component';
import { TopicsListAnswersComponent } from './topics-list-answers/topics-list-answers.component';
import { QuestionsListAnswersComponent } from './questions-list-answers/questions-list-answers.component';



@NgModule({
  declarations: [
    SessionsAnswersComponent,
    AssessmentsAnswersComponent,
    TopicsListAnswersComponent,
    QuestionsListAnswersComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AnswersModule { }
