import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSummaryComponent } from './assessment-summary.component';

describe('AssessmentSummaryComponent', () => {
  let component: AssessmentSummaryComponent;
  let fixture: ComponentFixture<AssessmentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
