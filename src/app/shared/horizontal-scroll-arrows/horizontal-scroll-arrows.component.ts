import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-scroll-arrows',
  templateUrl: './horizontal-scroll-arrows.component.html',
  styleUrls: ['./horizontal-scroll-arrows.component.scss']
})
export class HorizontalScrollArrowsComponent implements OnInit {
  @Input() scrollableElement: HTMLElement;
  @Input() pxScrollAmount: number;

  public isLeftScrollButtonEnabled = true;
  public isRightScrollButtonEnabled = true;

  constructor() { }

  ngOnInit(): void {
    this.handleEdgeReached();

    this.scrollableElement.addEventListener('scroll', (_) => {
      this.handleEdgeReached();
    });
  }

  public elementXOverflowEnabled(element): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  public scrollLeft(): void {
    this.scrollableElement.scrollBy({
      top: 0,
      left: -this.pxScrollAmount,
      behavior: 'smooth'
    });
    this.isRightScrollButtonEnabled = true;
  }

  public scrollRight(): void {
    this.scrollableElement.scrollBy({
      top: 0,
      left: this.pxScrollAmount,
      behavior: 'smooth'
    });
    this.isLeftScrollButtonEnabled = true;
  }

  private handleEdgeReached(): void {
    if (this.scrollableElement.scrollLeft === 0) {
      this.isLeftScrollButtonEnabled = false;
    } else if (this.scrollableElement.scrollLeft === this.scrollableElement.scrollWidth - this.scrollableElement.clientWidth) {
      this.isRightScrollButtonEnabled = false;
    }
  }
}
