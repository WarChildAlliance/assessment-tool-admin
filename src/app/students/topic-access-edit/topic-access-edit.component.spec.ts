import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicAccessEditComponent } from './topic-access-edit.component';

describe('TopicAccessEditComponent', () => {
  let component: TopicAccessEditComponent;
  let fixture: ComponentFixture<TopicAccessEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicAccessEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicAccessEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
