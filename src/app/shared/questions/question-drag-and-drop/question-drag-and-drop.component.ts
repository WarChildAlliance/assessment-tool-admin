import { Component, Input, OnInit, AfterViewInit, OnChanges, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question-drag-and-drop',
  templateUrl: './question-drag-and-drop.component.html',
  styleUrls: ['./question-drag-and-drop.component.scss']
})
export class QuestionDragAndDropComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() question: any;
  @Input() assessmentId: any;
  @Input() topicId: any;
  @Input() answer: any;
  @Input() evaluated: boolean;
  @Input() index: number;
  @Input() shrinkBackgroundImage = false;

  @ViewChild('rectangle') rectangleElement: ElementRef;
  @ViewChild('rectanglesList') rectanglesListElement: ElementRef;


  public imageAttachment = null;
  public audioAttachment = null;
  public backgroundImage = null;

  public draggableOptions = null;
  public optionsWithoutArea = [];

  private svgStyle: CSSStyleDeclaration;

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE' && i.background_image === false);
    this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
    this.backgroundImage = this.question.attachments.find( i => i.background_image === true);
  }

  ngAfterViewInit(): void {
    this.getDraggableOptions();
    this.svgStyle = this.rectangleElement.nativeElement.style;
    this.svgStyle.setProperty('visibility', 'hidden');
    this.reDraw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // To correctly show the question preview of different drag and drop questions in the question list
    if (changes.question?.previousValue?.id && (changes.question?.currentValue.id !== changes.question?.previousValue?.id)) {
      this.getDraggableOptions();
      this.imageAttachment = this.question.attachments.find( i => i.attachment_type === 'IMAGE' && i.background_image === false);
      this.audioAttachment = this.question.attachments.find( a => a.attachment_type === 'AUDIO');
      this.backgroundImage = this.question.attachments.find( i => i.background_image === true);

      this.svgStyle = this.rectangleElement.nativeElement.style;
      this.svgStyle.setProperty('visibility', 'hidden');
      this.reDraw();
    }
  }

  public getSource(path: string): string {
    return (path?.slice(0, 5) === 'http:') ? path : environment.API_URL + path;
  }

  public playAudio(file): void {
    const audio = new Audio(file);
    audio.load();
    audio.play();
  }

  public noOptions(areaId: number): boolean {
    return !(this.draggableOptions.find(item => item.area_option === areaId) !== undefined);
  }

  public getBackgroundImageTransform(bgElement: HTMLElement): string {
    if (this.shrinkBackgroundImage) {
      return `scale(calc(${bgElement.offsetWidth}/ 600))`;
    }
    return '';
  }

  public getAreaAnswer(areaId: number): any {
    return this.answer.answers_per_area.find(item => item.area.id === areaId);
  }

  private getDraggableOptions(): void {
    this.assessmentService.getDraggableOptions(
      this.assessmentId.toString(), this.topicId || this.question.assessment_topic.toString(), this.question.id
      ).subscribe(dragOptions => {
        this.draggableOptions = dragOptions.filter(item => item.area_option !== null);
        this.optionsWithoutArea = dragOptions.filter(item => item.area_option === null);
    });
  }

  private drawRect(svgElement, x: number, y: number, width: number, height: number): any {
    svgElement.setAttributeNS(null, 'width', width);
    svgElement.setAttributeNS(null, 'height', height);
    svgElement.setAttributeNS(null, 'x', x);
    svgElement.setAttributeNS(null, 'y', y);

    return svgElement;
  }

  private drawName(svgElement, x: number, y: number, areaNumber: number, fontSize = 20): any {
    svgElement.setAttribute('x', (x).toString());
    svgElement.setAttribute('y', (y + fontSize).toString());
    svgElement.innerHTML = areaNumber;
    svgElement.style.fill = 'white';
    svgElement.style.stroke = 'blue';
    svgElement.style.fontSize = fontSize.toString() + 'px';

    return svgElement;
  }

  private reDraw(): void {
    this.rectanglesListElement.nativeElement.innerHTML = '';
    let areaNumber = 1;
    const rectanglesListRef = this.rectanglesListElement.nativeElement as HTMLElement;

    this.question.drop_areas.forEach(area => {
      rectanglesListRef.appendChild(
        this.drawRect(
          document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
          area.x, area.y, area.width, area.height
        )
      );

      const fontSize = this.shrinkBackgroundImage ? 40 : 20;
      rectanglesListRef.appendChild(
        this.drawName(
          document.createElementNS('http://www.w3.org/2000/svg', 'text'),
          area.x, area.y, areaNumber, fontSize
        )
      );

      areaNumber++;
    });
  }
}
