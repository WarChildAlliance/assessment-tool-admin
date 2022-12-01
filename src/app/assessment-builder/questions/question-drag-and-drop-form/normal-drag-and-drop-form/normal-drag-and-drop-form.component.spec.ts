import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalDragAndDropFormComponent } from './normal-drag-and-drop-form.component';

describe('NormalDragAndDropFormComponent', () => {
  let component: NormalDragAndDropFormComponent;
  let fixture: ComponentFixture<NormalDragAndDropFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormalDragAndDropFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormalDragAndDropFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
