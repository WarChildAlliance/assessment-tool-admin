import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCalculFormComponent } from './question-calcul-form.component';

describe('QuestionCalculFormComponent', () => {
  let component: QuestionCalculFormComponent;
  let fixture: ComponentFixture<QuestionCalculFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionCalculFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCalculFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
