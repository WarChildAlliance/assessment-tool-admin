import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDragAndDropFormComponent } from './question-drag-and-drop-form.component';

describe('QuestionDragAndDropFormComponent', () => {
  let component: QuestionDragAndDropFormComponent;
  let fixture: ComponentFixture<QuestionDragAndDropFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionDragAndDropFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDragAndDropFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
