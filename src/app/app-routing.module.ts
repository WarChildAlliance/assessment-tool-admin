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
        { label: 'general.dashboard', url: '' }
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
        { label: 'general.studentsOverview', url: '' }
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
        { label: 'general.groupsOverview', url: '' }
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
        { label: 'general.assessmentsOverview', url: '' }
      ]
    },
  },
  {
    path: 'library',
    loadChildren: () => import('./library/library.module')
      .then(m => m.LibraryModule),
    canLoad: [AuthGuard],
    data: {
      breadcrumb: [
        { label: 'general.library', url: '' }
      ]
    },
  },
  {
    path: 'assessment-builder/:type',
    loadChildren: () => import('./assessment-builder/assessment-builder.module')
      .then(m => m.AssessmentBuilderModule),
    canLoad: [AuthGuard],
    data: {
      breadcrumb: [
        { label: 'general.assessmentBuilder', url: '' }
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
