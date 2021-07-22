import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss']
})
export class SelectOptionComponent implements OnInit {



  public selectOptionForm: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required]),
    valid: new FormControl('', [Validators.required]),
    audioAttachment: new FormControl('', [Validators.required]),
    imageAttachment: new FormControl('', [Validators.required])
  });


  constructor() { }

  ngOnInit(): void {
  }

  createOption(): void{
    console.log('option created');
  }

}
