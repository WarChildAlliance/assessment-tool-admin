import { Component, ElementRef, AfterViewInit, ViewChild, Renderer2, NgZone, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AreaOption } from 'src/app/core/models/question.model';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  areas?: [];
  image_background?: File;
}

@Component({
  selector: 'app-area-selector',
  templateUrl: './area-selector.component.html',
  styleUrls: ['./area-selector.component.scss']
})

export class AreaSelectorComponent implements AfterViewInit {
  public attachmentsResetSubject$ = new Subject<void>();
  public imageAttachment = null;

  public icon = '';
  public areasOptions: AreaOption[] = [];

  private startX = 0;
  private startY = 0;

  private unlistenStartDrag: () => void;
  private unlistenMoveDrag: () => void;
  private unlistenStopDrag: () => void;

  private svgStyle: CSSStyleDeclaration;

  @ViewChild('draw') drawElement: ElementRef;
  @ViewChild('rectangle') rectangleElement: ElementRef;
  @ViewChild('rectanglesList') rectanglesListElement: ElementRef;
  @ViewChild('areaSelectorDialog') areaSelectorDialogElement: ElementRef;

  public coordinatesForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    x: new FormControl(null, Validators.required),
    y: new FormControl(null, Validators.required),
    width: new FormControl(null, Validators.required),
    height: new FormControl(null, Validators.required),
    image: new FormControl(null, Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {
    if (this.data?.areas && this.data?.image_background) {
      this.imageAttachment = this.data?.image_background;
      this.coordinatesForm.controls.image.setValue(this.data?.image_background);
      this.onNewImageAttachment(this.imageAttachment);

      this.areasOptions = this.data?.areas;
    }
  }

  ngAfterViewInit(): void {
    this.svgStyle = this.rectangleElement.nativeElement.style;
    this.svgStyle.setProperty('visibility', 'hidden');

    const drawElRef = this.drawElement.nativeElement;
    const dialogRef = this.areaSelectorDialogElement.nativeElement;

    if (this.data?.areas && this.data?.image_background) {
      this.reDraw();
    }

    this.coordinatesForm.controls.name.statusChanges.subscribe(statusName => {
      if (statusName === 'VALID') {
        this.renderer.setStyle(drawElRef, 'pointer-events', 'all');

        this.unlistenStartDrag = this.renderer.listen(drawElRef, 'pointerdown', eventStarDrag => {
          this.startDrag(eventStarDrag);

          this.ngZone.runOutsideAngular(() => {
            this.unlistenMoveDrag = this.renderer.listen(drawElRef, 'pointermove', eventMoveDrag => {
              this.moveDrag(eventMoveDrag);
            });
          });

          this.unlistenStopDrag = this.renderer.listen(dialogRef, 'pointerup', eventStopDrag => {
            this.stopDrag(eventStopDrag);
            this.unlistenMoveDrag();
            this.unlistenStopDrag();
          });
        });
      } else {
        this.renderer.setStyle(drawElRef, 'pointer-events', 'none');
        this.unlistenStartDrag();
      }
    });
  }

  private startDrag(event): void {
    this.svgStyle.setProperty('visibility', 'visible');
    this.startX = event.layerX;
    this.startY = event.layerY;

    this.drawRect(this.rectangleElement.nativeElement, this.startX, this.startY, 0, 0);
  }

  private stopDrag(event): void {
    this.svgStyle.setProperty('visibility', 'hidden');

    if (event.target === this.drawElement.nativeElement && this.coordinatesForm.valid) {
      this.addArea();
      this.reDraw();
    }
  }

  private moveDrag(event): void {
    let x = event.layerX;
    let y = event.layerY;
    let width = this.startX - x;
    let height = this.startY - y;

    if (width < 0) {
      width *= -1;
      x -= width;
    }
    if (height < 0) {
      height *= -1;
      y -= height;
    }
    this.coordinatesForm.controls.x.setValue(x);
    this.coordinatesForm.controls.y.setValue(y);

    this.coordinatesForm.controls.width.setValue(width);
    this.coordinatesForm.controls.height.setValue(height);

    this.drawRect(this.rectangleElement.nativeElement, x, y, width, height);
  }

  private drawRect(svgElement, x: number, y: number, width: number, height: number): any {
    svgElement.setAttributeNS(null, 'width', width);
    svgElement.setAttributeNS(null, 'height', height);
    svgElement.setAttributeNS(null, 'x', x);
    svgElement.setAttributeNS(null, 'y', y);

    return svgElement;
  }

  private drawName(svgElement, x: number, y: number, areaNumber: number): any {
    svgElement.setAttribute('x', (x).toString());
    svgElement.setAttribute('y', (y + 20).toString());
    svgElement.innerHTML = areaNumber;
    svgElement.style.fill = 'white';
    svgElement.style.stroke = 'blue';
    svgElement.style.fontSize = '20';

    return svgElement;
  }

  private reDraw(): void {
    this.rectanglesListElement.nativeElement.innerHTML = '';
    let areaNumber = 1;
    const rectanglesListRef = this.rectanglesListElement.nativeElement as HTMLElement;

    this.areasOptions.forEach(area => {
      rectanglesListRef.appendChild(
        this.drawRect(
          document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
          area.x, area.y, area.width, area.height
        )
      );

      rectanglesListRef.appendChild(
        this.drawName(
          document.createElementNS('http://www.w3.org/2000/svg', 'text'),
          area.x, area.y, areaNumber
        )
      );

      areaNumber++;
    });
  }

  public onNewImageAttachment(event: any): void {
    this.imageAttachment = event;
    this.coordinatesForm.controls.image.setValue(event);

    // Handle File Select
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(event);
  }

  private handleReaderLoaded(readerEvt: any): void {
    const binaryString = readerEvt.target.result;
    this.icon = 'data:image/jpg;base64,' + btoa(binaryString);
  }

  public removeArea(area: number): void {
    this.areasOptions.splice(area, 1);
    this.reDraw();
  }

  public addArea(): void {
    const newAreaOption = {
      x: this.coordinatesForm.controls.x.value,
      y: this.coordinatesForm.controls.y.value,
      width: this.coordinatesForm.controls.width.value,
      height: this.coordinatesForm.controls.height.value,
      name: this.coordinatesForm.controls.name.value
    };
    this.areasOptions.push(newAreaOption);

    this.coordinatesForm.reset({
      image: this.coordinatesForm.controls.image.value
    });
  }
}
