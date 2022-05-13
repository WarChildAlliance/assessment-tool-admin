import { Component, Input } from '@angular/core';
import { IconVariant } from './icon-variant.enum';

@Component({
  selector: 'app-custom-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class CustomIconComponent {
  @Input() icon = '';

  @Input() inline = false;

  @Input() variant: IconVariant | string = IconVariant.DEFAULT;

  @Input() size = 24;

  get fontSize(): string {
    return this.size + 'px';
  }

  get color(): string {
    switch (this.variant) {
      case IconVariant.PRIMARY: {
        return 'primary';
      }
      case IconVariant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  constructor() {}
}
