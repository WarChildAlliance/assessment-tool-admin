import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { AssessmentsComponent } from './assessments.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentsComponent
  },
  {
    path: ':id',
    component: AssessmentDetailComponent,
    data: {
      breadcrumb: [
        { label: 'general.assessmentsOverview', url: '/assessments' },
        { label: 'general.topics', url: '' }
      ]
    },
  },
  {
    path: ':assessment_id/topics/:topic_id',
    component: QuestionsListComponent,
    data: {
      breadcrumb: [
        { label: 'general.assessmentsOverview', url: '/assessments' },
        { label: 'general.topics', url: '/assessments/:assessment_id' },
        { label: 'general.questions', url: '' }
      ]
    },
  },
  {
    path: ':assessment_id/topics/:topic_id/questions/:question_id',
    component: QuestionDetailComponent,
    data: {
      breadcrumb: [
        { label: 'general.assessmentsOverview', url: '/assessments' },
        { label: 'general.topics', url: '/assessments/:assessment_id' },
        { label: 'general.questions', url: '/assessments/:assessment_id/topics/:topic_id' },
        { label: 'general.questionDetails', url: '' }
      ]
    },
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
export class AssessmentsRoutingModule { }
