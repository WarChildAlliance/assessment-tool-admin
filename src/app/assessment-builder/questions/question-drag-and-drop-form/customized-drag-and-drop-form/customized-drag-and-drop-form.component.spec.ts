import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedDragAndDropFormComponent } from './customized-drag-and-drop-form.component';

describe('CustomizedDragAndDropFormComponent', () => {
  let component: CustomizedDragAndDropFormComponent;
  let fixture: ComponentFixture<CustomizedDragAndDropFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizedDragAndDropFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizedDragAndDropFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
