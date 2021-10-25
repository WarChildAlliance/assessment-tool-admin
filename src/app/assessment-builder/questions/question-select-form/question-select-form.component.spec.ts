import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSelectFormComponent } from './question-select-form.component';

describe('QuestionSelectFormComponent', () => {
  let component: QuestionSelectFormComponent;
  let fixture: ComponentFixture<QuestionSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSelectFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSelectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
