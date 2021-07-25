import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss']
})
export class SelectOptionComponent implements OnInit {

  @Input() option = null;
  @Output() saveOptionEvent = new EventEmitter<any>();

  public selectOptionForm: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required]),
    valid: new FormControl('', [Validators.required]),
    audioAttachment: new FormControl('', [Validators.required]),
    imageAttachment: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
    if (this.option) {
      this.selectOptionForm.setValue({value: this.option.value, valid: this.option.valid, audioAttachment: null, imageAttachment: null});
    }
  }

  createOption(): void{
    this.saveOptionEvent.emit(this.selectOptionForm);
  }

}
