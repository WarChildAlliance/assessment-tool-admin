import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topicId: number;

  public selectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    multiple: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
  }

  createSelect(): void {
    console.log('created select');
  }

}
