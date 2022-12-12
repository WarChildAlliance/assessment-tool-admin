import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetOfQuestionsComponent } from './set-of-questions.component';

const routes: Routes = [
  {
    path: '',
    component: SetOfQuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetOfQuestionsRoutingModule { }
