import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionSetAccessModalComponent } from './question-set-access-modal.component';

describe('QuestionSetAccessModalComponent', () => {
  let component: QuestionSetAccessModalComponent;
  let fixture: ComponentFixture<QuestionSetAccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSetAccessModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
