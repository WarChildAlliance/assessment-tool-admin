import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedDragAndDropComponent } from './customized-drag-and-drop.component';

describe('CustomizedDragAndDropComponent', () => {
  let component: CustomizedDragAndDropComponent;
  let fixture: ComponentFixture<CustomizedDragAndDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizedDragAndDropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizedDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
