import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentFormDialogComponent } from './assessment-form-dialog.component';

describe('AssessmentFormDialogComponent', () => {
  let component: AssessmentFormDialogComponent;
  let fixture: ComponentFixture<AssessmentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
