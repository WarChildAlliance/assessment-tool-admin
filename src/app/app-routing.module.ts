import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule),
      canLoad: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    canLoad: [AuthGuard],
    data: {
      breadcrumb: [
        { label: 'Dashboard', url: '' }
      ]
    },
  },
  {
    path: 'students',
    loadChildren: () => import('./students/students.module')
      .then(m => m.StudentsModule),
    canLoad: [AuthGuard],
    data: {
      breadcrumb: [
        { label: 'Students overview', url: '' }
      ]
    },
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module')
      .then(m => m.GroupsModule),
    canLoad: [AuthGuard],
    data: {
      breadcrumb: [
        { label: 'Groups overview', url: '' }
      ]
    },
  },
  {
    path: 'assessments',
    loadChildren: () => import('./assessments/assessments.module')
      .then(m => m.AssessmentsModule),
    canLoad: [AuthGuard],
    data: {
      breadcrumb: [
        { label: 'Assessments overview', url: '' }
      ]
    },
  },
  {
    path: 'assessment-builder',
    loadChildren: () => import('./assessment-builder/assessment-builder.module')
      .then(m => m.AssessmentBuilderModule),
    canLoad: [AuthGuard],
    data: {
      breadcrumb: [
        { label: 'Assessment Builder', url: '' }
      ]
    },
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
