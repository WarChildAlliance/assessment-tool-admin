import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetAccessesBuilderComponent } from './question-set-accesses-builder.component';

describe('QuestionSetAccessesBuilderComponent', () => {
  let component: QuestionSetAccessesBuilderComponent;
  let fixture: ComponentFixture<QuestionSetAccessesBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSetAccessesBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetAccessesBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
