import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsOverviewChartComponent } from './questions-overview-chart.component';

describe('QuestionsOverviewChartComponent', () => {
  let component: QuestionsOverviewChartComponent;
  let fixture: ComponentFixture<QuestionsOverviewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsOverviewChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsOverviewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
