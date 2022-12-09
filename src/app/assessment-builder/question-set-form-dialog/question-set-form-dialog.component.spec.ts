import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetFormDialogComponent } from './question-set-form-dialog.component';

describe('QuestionSetFormDialogComponent', () => {
  let component: QuestionSetFormDialogComponent;
  let fixture: ComponentFixture<QuestionSetFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSetFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
