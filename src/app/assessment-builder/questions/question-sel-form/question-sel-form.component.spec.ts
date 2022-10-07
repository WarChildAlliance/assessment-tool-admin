import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSelFormComponent } from './question-sel-form.component';

describe('QuestionSelFormComponent', () => {
  let component: QuestionSelFormComponent;
  let fixture: ComponentFixture<QuestionSelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSelFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
