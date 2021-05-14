import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentsAnswersComponent } from '../answers/assessments-answers/assessments-answers.component';
import { QuestionDetailAnswersComponent } from '../answers/question-detail-answers/question-detail-answers.component';
import { QuestionsListAnswersComponent } from '../answers/questions-list-answers/questions-list-answers.component';
import { TopicsListAnswersComponent } from '../answers/topics-list-answers/topics-list-answers.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentsComponent } from './students.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent
  },
  {
    path: ':student_id',
    component: StudentDetailComponent
  },
  {
    path: ':student_id/assessments',
    component: AssessmentsAnswersComponent
  },
  {
    path: ':student_id/assessments/:assessment_id/topics',
    component: TopicsListAnswersComponent
  },
  {
    path: ':student_id/assessments/:assessment_id/topics/:topic_id/questions',
    component: QuestionsListAnswersComponent
  },
  {
    path: ':student_id/assessments/:assessment_id/topics/:topic_id/questions/:question_id',
    component: QuestionDetailAnswersComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
