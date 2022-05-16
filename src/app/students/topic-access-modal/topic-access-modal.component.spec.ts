import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicAccessModalComponent } from './topic-access-modal.component';

describe('TopicAccessModalComponent', () => {
  let component: TopicAccessModalComponent;
  let fixture: ComponentFixture<TopicAccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicAccessModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
