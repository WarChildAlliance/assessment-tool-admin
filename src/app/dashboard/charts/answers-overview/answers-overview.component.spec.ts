import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersOverviewComponent } from './answers-overview.component';

describe('AnswersOverviewComponent', () => {
  let component: AnswersOverviewComponent;
  let fixture: ComponentFixture<AnswersOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswersOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
