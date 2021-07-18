import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit {

  public sortForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    categoryA: new FormControl('', [Validators.required]),
    categoryB: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
  }

  createSort(): void {
    console.log('created sort');
  }

}
