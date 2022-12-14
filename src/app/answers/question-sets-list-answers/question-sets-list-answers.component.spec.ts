import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetsListAnswersComponent } from './question-sets-list-answers.component';

describe('QuestionSetsListAnswersComponent', () => {
  let component: QuestionSetsListAnswersComponent;
  let fixture: ComponentFixture<QuestionSetsListAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSetsListAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetsListAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
