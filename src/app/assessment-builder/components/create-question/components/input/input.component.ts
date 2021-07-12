import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  constructor() { }

  public inputForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    answer: new FormControl('', [Validators.required]),
    imageAttachment: new FormControl('', [Validators.required]),
    audioAttachment: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
  }

  createInput(): void{
    console.log('here');
  }
}
