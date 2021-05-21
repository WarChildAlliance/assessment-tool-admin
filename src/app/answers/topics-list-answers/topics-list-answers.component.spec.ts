import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsListAnswersComponent } from './topics-list-answers.component';

describe('TopicsListAnswersComponent', () => {
  let component: TopicsListAnswersComponent;
  let fixture: ComponentFixture<TopicsListAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicsListAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsListAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
