import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDominoFormComponent } from './question-domino-form.component';

describe('QuestionDominoFormComponent', () => {
  let component: QuestionDominoFormComponent;
  let fixture: ComponentFixture<QuestionDominoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionDominoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDominoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
