import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentBuilderComponent } from './assessment-builder.component';
import { TopicDetailsComponent } from './topic-details/topic-details.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentBuilderComponent
  },
  {
    path: ':assessment_id/topic/:topic_id',
    component: TopicDetailsComponent,
    data: {
      breadcrumb: [
        { label: 'Assessments builder', url: '/assessment-builder' },
        { label: 'Question', url: '' }
      ]
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentBuilderRoutingModule { }
