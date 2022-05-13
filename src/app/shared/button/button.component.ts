import {
  Component,
  OnInit,
  HostBinding,
  Input,
} from '@angular/core';
import { Subject } from 'rxjs';
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
  @Input()
  disabled = false;

  @Input() icon = '';

  public emittedEventSubject: Subject<string> = new Subject();

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

  constructor() {}

  ngOnInit(): void {}
}
