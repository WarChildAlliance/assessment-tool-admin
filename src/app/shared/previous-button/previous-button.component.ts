import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-previous-button',
  templateUrl: './previous-button.component.html',
  styleUrls: ['./previous-button.component.scss'],
})
export class PreviousButtonComponent implements OnInit {
  @Input() path = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onPrevious(): void {
    this.router.navigate([this.path]);
  }
}
