import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSelectorComponent } from './audio-selector.component';

describe('AudioSelectorComponent', () => {
  let component: AudioSelectorComponent;
  let fixture: ComponentFixture<AudioSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
