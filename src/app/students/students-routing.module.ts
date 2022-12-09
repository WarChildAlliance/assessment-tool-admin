import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionDetailAnswersComponent } from '../answers/question-detail-answers/question-detail-answers.component';
import { QuestionsListAnswersComponent } from '../answers/questions-list-answers/questions-list-answers.component';
import { QuestionSetsListAnswersComponent } from '../answers/question-sets-list-answers/question-sets-list-answers.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentsComponent } from './students.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
  },
  {
    path: ':student_id',
    component: StudentDetailComponent,
    data: {
      breadcrumb: [
        { label: 'general.studentsOverview', url: '/students' },
        { label: 'students.studentDetails', url: '' }
      ]
    },
  },
  {
    path: ':student_id/assessments/:assessment_id/question-sets',
    component: QuestionSetsListAnswersComponent,
    data: {
      breadcrumb: [
        { label: 'general.studentsOverview', url: '/students' },
        { label: 'students.studentDetails', url: '/students/:student_id' },
        { label: 'general.questionSets', url: '' }
      ]
    },
  },
  {
    path: ':student_id/assessments/:assessment_id/question-sets/:question_set_id/questions',
    component: QuestionsListAnswersComponent,
    data: {
      breadcrumb: [
        { label: 'general.studentsOverview', url: '/students' },
        { label: 'students.studentDetails', url: '/students/:student_id' },
        { label: 'general.questionSets', url: '/students/:student_id/assessments/:assessment_id/question-sets' },
        { label: 'general.questions', url: '' }
      ]
    },
  },
  {
    path: ':student_id/assessments/:assessment_id/question-sets/:question_set_id/questions/:question_id',
    component: QuestionDetailAnswersComponent,
    data: {
      breadcrumb: [
        { label: 'general.studentsOverview', url: '/students' },
        { label: 'students.studentDetails', url: '/students/:student_id' },
        { label: 'general.questionSets', url: '/students/:student_id/assessments/:assessment_id/question-sets' },
        { label: 'general.questions', url: '/students/:student_id/assessments/:assessment_id/question-sets/:question_set_id/questions' },
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
export class StudentsRoutingModule { }
