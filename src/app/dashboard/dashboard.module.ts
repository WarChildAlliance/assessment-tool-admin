import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionsOverviewChartComponent } from './charts/questions-overview-chart/questions-overview-chart.component';
import { ScoreByTopicChartComponent } from './charts/score-by-topic-chart/score-by-topic-chart.component';
import { ScoreByTopicTableComponent } from './charts/score-by-topic-table/score-by-topic-table.component';



@NgModule({
  declarations: [
    DashboardComponent,
    QuestionsOverviewChartComponent,
    ScoreByTopicChartComponent,
    ScoreByTopicTableComponent
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
    ChartsModule,
    SharedModule
  ]
})
export class DashboardModule { }
