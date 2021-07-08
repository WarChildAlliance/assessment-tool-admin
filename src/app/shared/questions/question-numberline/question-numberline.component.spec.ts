import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionNumberlineComponent } from './question-numberline.component';

describe('QuestionNumberlineComponent', () => {
  let component: QuestionNumberlineComponent;
  let fixture: ComponentFixture<QuestionNumberlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionNumberlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionNumberlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
