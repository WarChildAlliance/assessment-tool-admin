import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreByQuestionSetTableComponent } from './score-by-question-set-table.component';

describe('ScoreByQuestionSetTableComponent', () => {
  let component: ScoreByQuestionSetTableComponent;
  let fixture: ComponentFixture<ScoreByQuestionSetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreByQuestionSetTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreByQuestionSetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
