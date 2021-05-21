import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicAccessesBuilderComponent } from './topic-accesses-builder.component';

describe('TopicAccessesBuilderComponent', () => {
  let component: TopicAccessesBuilderComponent;
  let fixture: ComponentFixture<TopicAccessesBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicAccessesBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicAccessesBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
