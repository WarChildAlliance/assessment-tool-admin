import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { LibraryComponent } from './library.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';

const routes: Routes = [
  {
    path: '',
    component: LibraryComponent
  },
  {
    path: ':id',
    component: AssessmentDetailComponent,
    data: {
      breadcrumb: [
        { label: 'general.assessmentsOverview', url: '/assessments' },
        { label: 'general.questionSets', url: '' }
      ]
    },
  },
  {
    path: ':assessment_id/question-sets/:question_set_id',
    component: QuestionsListComponent,
    data: {
      breadcrumb: [
        { label: 'general.assessmentsOverview', url: '/assessments' },
        { label: 'general.questionSets', url: '/library/:assessment_id' },
        { label: 'general.questions', url: '' }
      ]
    },
  },
  {
    path: ':assessment_id/question-sets/:question_set_id/questions/:question_id',
    component: QuestionDetailComponent,
    data: {
      breadcrumb: [
        { label: 'general.assessmentsOverview', url: '/library' },
        { label: 'general.questionSets', url: '/library/:assessment_id' },
        { label: 'general.questions', url: '/library/:assessment_id/question-sets/:question_set_id' },
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
export class LibraryRoutingModule { }
