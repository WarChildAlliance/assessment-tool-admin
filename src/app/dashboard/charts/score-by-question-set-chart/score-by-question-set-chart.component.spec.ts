import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreByQuestionSetChartComponent } from './score-by-question-set-chart.component';

describe('ScoreByQuestionSetChartComponent', () => {
  let component: ScoreByQuestionSetChartComponent;
  let fixture: ComponentFixture<ScoreByQuestionSetChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreByQuestionSetChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreByQuestionSetChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
