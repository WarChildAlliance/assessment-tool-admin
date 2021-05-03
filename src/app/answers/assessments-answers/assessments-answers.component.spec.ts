import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsAnswersComponent } from './assessments-answers.component';

describe('AssessmentsAnswersComponent', () => {
  let component: AssessmentsAnswersComponent;
  let fixture: ComponentFixture<AssessmentsAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentsAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
