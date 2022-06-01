import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AreaOption } from 'src/app/core/models/question.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  public attachmentsResetSubject$ = new Subject<void>();
  public imageAttachment = null;

  public icon = '';
  public point = 1;
  public areasOptions: AreaOption[] = [];
  private areaNumber = 0;

  public coordinatesForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    x1: new FormControl(null, Validators.required),
    y1: new FormControl(null, Validators.required),
    x2: new FormControl(null, Validators.required),
    y2: new FormControl(null, Validators.required),
    image: new FormControl(null),
  });

  constructor( ) { }

  ngOnInit(): void {}

  private findPosition(oElement): number[] {
    if (typeof( oElement.offsetParent ) !== 'undefined') {
      let posX = 0;
      let posY = 0;
      for (posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
      return [ posX, posY ];
    } else {
      return [ oElement.x, oElement.y ];
    }
  }

  public getCoordinates(event: MouseEvent): void {
    const myImg = document.getElementById('myImg');

    let PosX = event.pageX;
    let PosY = event.pageY;
    const ImgPos = this.findPosition(myImg);

    PosX = PosX - ImgPos[0];
    PosY = PosY - ImgPos[1];

    if (this.point === 1) {
      this.point = 2;
      this.coordinatesForm.controls.x1.setValue(PosX);
      this.coordinatesForm.controls.y1.setValue(PosY);
    } else {
      this.point = 1;
      this.coordinatesForm.controls.x2.setValue(PosX);
      this.coordinatesForm.controls.y2.setValue(PosY);
    }
  }

  // works?
  public drawOnCanvas(draw?: boolean): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const p1 = this.coordinatesForm.controls.x1.value;
    const p2 = this.coordinatesForm.controls.y1.value;
    const p3 = this.coordinatesForm.controls.x2.value;
    const p4 = this.coordinatesForm.controls.y2.value;

    const imageObj = new Image();
    imageObj.onload = () => {
      canvas.width = 400;
      canvas.height = 300;
      canvas.style.width = canvas.width + 'px';
      canvas.style.height = canvas.height + 'px';

      ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    };
    imageObj.src = this.icon;

    // to draw multiple rectangles on the canvas
    if (draw) {
      const width = p3 - p1;
      const height = p4 - p2;

      imageObj.onload = () => {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(p1, p2, width, height);
        ctx.font = '15px Georgia';
        ctx.fillStyle = 'blue';
        ctx.fillText(this.areaNumber.toString(), p1 + (width / 2), p2 + (height / 2));
      };
    }
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

  public onAddCoordinates(): void {
    const coordinatesArray = [this.coordinatesForm.controls.x1.value, this.coordinatesForm.controls.y1.value,
      this.coordinatesForm.controls.x2.value, this.coordinatesForm.controls.y2.value];

    const newAreaOption = {
      coordinates: coordinatesArray,
      name: this.coordinatesForm.controls.name.value
    };
    this.areasOptions.push(newAreaOption);

    this.areaNumber++;
    this.drawOnCanvas(true);
    this.coordinatesForm.reset();
  }

  public onResetCoordinates(): void {
    this.coordinatesForm.reset();
  }

  public onSubmmit(): void {
    console.log('submmit data');
  }
}
