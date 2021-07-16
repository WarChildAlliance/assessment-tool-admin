import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreByTopicChartComponent } from './score-by-topic-chart.component';

describe('ScoreByTopicChartComponent', () => {
  let component: ScoreByTopicChartComponent;
  let fixture: ComponentFixture<ScoreByTopicChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreByTopicChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreByTopicChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
