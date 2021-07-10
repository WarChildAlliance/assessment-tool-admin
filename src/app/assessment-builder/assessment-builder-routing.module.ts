import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentBuilderComponent } from './assessment-builder.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentBuilderRoutingModule { }
