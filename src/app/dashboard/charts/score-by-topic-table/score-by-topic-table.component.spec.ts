import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreByTopicTableComponent } from './score-by-topic-table.component';

describe('ScoreByTopicTableComponent', () => {
  let component: ScoreByTopicTableComponent;
  let fixture: ComponentFixture<ScoreByTopicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreByTopicTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreByTopicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
