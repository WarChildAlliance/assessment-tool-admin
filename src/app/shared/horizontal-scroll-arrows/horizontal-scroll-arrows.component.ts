import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-scroll-arrows',
  templateUrl: './horizontal-scroll-arrows.component.html',
  styleUrls: ['./horizontal-scroll-arrows.component.scss']
})
export class HorizontalScrollArrowsComponent implements OnInit {
  @Input() scrollableElement: HTMLElement;
  @Input() pxScrollAmount: number;

  public leftScrollEnabled = true;
  public rightScrollEnabled = true;

  constructor() { }

  ngOnInit(): void {
    this.handleEdgeReached();

    this.scrollableElement.addEventListener('scroll', (_) => {
      this.handleEdgeReached();
    });
  }

  private handleEdgeReached(): void {
    if (this.scrollableElement.scrollLeft === 0) {
      this.leftScrollEnabled = false;
    } else if (this.scrollableElement.scrollLeft === this.scrollableElement.scrollWidth - this.scrollableElement.clientWidth) {
      this.rightScrollEnabled = false;
    }
  }

  elementXOverflowEnabled(element): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  scrollPrevious(): void {
    this.scrollableElement.scrollBy({
      top: 0,
      left: -this.pxScrollAmount,
      behavior: 'smooth'
    });
    this.rightScrollEnabled = true;
  }

  scrollNext(): void {
    this.scrollableElement.scrollBy({
      top: 0,
      left: this.pxScrollAmount,
      behavior: 'smooth'
    });
    this.leftScrollEnabled = true;
  }
}
