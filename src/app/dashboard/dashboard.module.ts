import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionsOverviewChartComponent } from './charts/questions-overview-chart/questions-overview-chart.component';
import { ScoreByQuestionSetChartComponent } from './charts/score-by-question-set-chart/score-by-question-set-chart.component';
import { ScoreByQuestionSetTableComponent } from './charts/score-by-question-set-table/score-by-question-set-table.component';
import { AnswersOverviewComponent } from './charts/answers-overview/answers-overview.component';
import { SelectGroupComponent } from './select-group/select-group.component';
import { CustomSpinnerModule } from '../shared/spinner/spinner.module';

@NgModule({
  declarations: [
    DashboardComponent,
    QuestionsOverviewChartComponent,
    ScoreByQuestionSetChartComponent,
    ScoreByQuestionSetTableComponent,
    AnswersOverviewComponent,
    SelectGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    ChartsModule,
    SharedModule,
    CustomSpinnerModule
  ]
})
export class DashboardModule { }
