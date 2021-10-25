import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionInputFormComponent } from './question-input-form.component';

describe('QuestionInputFormComponent', () => {
  let component: QuestionInputFormComponent;
  let fixture: ComponentFixture<QuestionInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionInputFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
