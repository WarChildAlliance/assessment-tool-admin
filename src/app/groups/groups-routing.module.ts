import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupsComponent } from './groups.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
  },
  {
    path: ':groupId',
    component: GroupDetailComponent,
    data: {
      breadcrumb: [
        { label: 'Groups overview', url: '/groups' },
        { label: 'Group details', url: '' }
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
  export class GroupsRoutingModule { }
