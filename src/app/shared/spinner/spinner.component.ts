import { Component, Input, OnInit } from '@angular/core';
import { SpinnerSize } from './spinner-size.enum';
import { SpinnerVariant } from './spinner-variant.enum';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class CustomSpinnerComponent implements OnInit {
  @Input() size: SpinnerSize | string = SpinnerSize.MEDIUM;

  @Input() variant: SpinnerVariant | string = SpinnerVariant.DEFAULT;

  constructor() {}

  get diameter(): number {
    switch (this.size) {
      case SpinnerSize.SMALL: {
        return 18;
      }
      case SpinnerSize.MEDIUM: {
        return 24;
      }
      case SpinnerSize.LARGE: {
        return 100;
      }
      default: {
        return 24;
      }
    }
  }

  get color(): string {
    switch (this.variant) {
      case SpinnerVariant.PRIMARY: {
        return 'primary';
      }
      case SpinnerVariant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  ngOnInit(): void {}
}
