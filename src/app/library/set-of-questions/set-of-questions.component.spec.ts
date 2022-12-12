import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetOfQuestionsComponent } from './set-of-questions.component';

describe('SetOfQuestionsComponent', () => {
  let component: SetOfQuestionsComponent;
  let fixture: ComponentFixture<SetOfQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetOfQuestionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetOfQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
