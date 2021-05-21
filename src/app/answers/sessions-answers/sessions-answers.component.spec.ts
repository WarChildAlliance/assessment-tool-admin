import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsAnswersComponent } from './sessions-answers.component';

describe('SessionsAnswersComponent', () => {
  let component: SessionsAnswersComponent;
  let fixture: ComponentFixture<SessionsAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionsAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
