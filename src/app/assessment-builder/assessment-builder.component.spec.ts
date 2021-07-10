import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentBuilderComponent } from './assessment-builder.component';

describe('AssessmentBuilderComponent', () => {
  let component: AssessmentBuilderComponent;
  let fixture: ComponentFixture<AssessmentBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
