import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { AssessmentsComponent } from './assessments.component';
import { TopicDetailComponent } from './topic-detail/topic-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentsComponent
  },
  {
    path: ':id',
    component: AssessmentDetailComponent
  },
  {
    path: ':id/topics/:id',
    component: TopicDetailComponent
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
