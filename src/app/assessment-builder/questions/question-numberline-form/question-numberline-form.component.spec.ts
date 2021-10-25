import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionNumberlineFormComponent } from './question-numberline-form.component';

describe('QuestionNumberlineFormComponent', () => {
  let component: QuestionNumberlineFormComponent;
  let fixture: ComponentFixture<QuestionNumberlineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionNumberlineFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionNumberlineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
