import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentBuilderComponent } from './assessment-builder.component';
import { QuestionSetDetailsComponent } from './question-set-details/question-set-details.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentBuilderComponent
  },
  {
    path: ':assessment_id/question_sets/:question_set_id',
    component: QuestionSetDetailsComponent,
    data: {
      breadcrumb: [
        { label: 'general.assessmentBuilder', url: '/assessment-builder' },
        { label: 'general.question', url: '' }
      ]
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentBuilderRoutingModule { }
