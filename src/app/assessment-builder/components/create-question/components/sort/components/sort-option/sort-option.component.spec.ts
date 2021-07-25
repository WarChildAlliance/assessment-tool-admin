import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortOptionComponent } from './sort-option.component';

describe('SortOptionComponent', () => {
  let component: SortOptionComponent;
  let fixture: ComponentFixture<SortOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
