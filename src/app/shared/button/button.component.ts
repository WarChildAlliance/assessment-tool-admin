import {
  Component,
  OnInit,
  HostBinding,
  Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerVariant } from '../spinner/spinner-variant.enum';
import { ButtonCategory } from './button-category.enum';
import { ButtonSize } from './button-size.enum';
import { ButtonVariant } from './button-variant.enum';

@Component({
  selector: 'app-custom-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class CustomButtonComponent implements OnInit {
  @Input() category: ButtonCategory | string = ButtonCategory.PRIMARY;

  @Input() size: ButtonSize | string = ButtonSize.MEDIUM;

  @Input() variant: ButtonVariant | string = ButtonVariant.DEFAULT;

  @Input() isIcon = false;

  @Input() block = false;

  @HostBinding('class.disabled')
  @Input() disabled = false;

  @Input() loading = false;

  @Input() icon = '';

  public emittedEventSubject: Subject<string> = new Subject();

  constructor() {}

  public get color(): string {
    switch (this.variant) {
      case ButtonVariant.PRIMARY: {
        return 'accent';
      }
      case ButtonVariant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  get spinnerVariant(): string {
    switch (this.category) {
      case ButtonCategory.PRIMARY: {
        return this.variant;
      }
      case ButtonCategory.TERTIARY: {
        return this.variant;
      }
      default: {
        switch (this.variant) {
          case ButtonVariant.DEFAULT: {
            return SpinnerVariant.PRIMARY;
          }
          default: {
            return SpinnerVariant.LIGHT;
          }
        }
      }
    }
  }

  ngOnInit(): void {}
}
