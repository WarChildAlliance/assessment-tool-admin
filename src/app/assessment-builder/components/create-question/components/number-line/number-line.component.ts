import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-number-line',
  templateUrl: './number-line.component.html',
  styleUrls: ['./number-line.component.scss']
})
export class NumberLineComponent implements OnInit {

  public numberLineForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    endNumber: new FormControl('', [Validators.required]),
    stepSize: new FormControl('', [Validators.required]),
    solution: new FormControl('', [Validators.required]),
    showTicks: new FormControl('', [Validators.required]),
    showValue: new FormControl('', [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    console.log('create numberLine');
  }

}
