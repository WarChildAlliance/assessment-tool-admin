import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsListAnswersComponent } from './questions-list-answers.component';

describe('QuestionsListAnswersComponent', () => {
  let component: QuestionsListAnswersComponent;
  let fixture: ComponentFixture<QuestionsListAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsListAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsListAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
