import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { QuestionFormService } from 'src/app/core/services/question-form.service';
import { AreaSelectorComponent } from '../../area-selector/area-selector.component';

@Component({
  selector: 'app-normal-drag-and-drop-form',
  templateUrl: './normal-drag-and-drop-form.component.html',
  styleUrls: ['./normal-drag-and-drop-form.component.scss']
})
export class NormalDragAndDropFormComponent implements OnInit {
  @ViewChild('dragItems') dragItemsElement: ElementRef;

  @Input() assessmentId: string;
  @Input() topicId: string;
  @Input() order: any;
  @Input() question: any;
  @Input() toClone: boolean;
  @Input() createDraggableOptions$: Observable<any>;

  @Output() dragAndDropDetailsForm = new EventEmitter<any>();
  @Output() changedBackgroundImage = new EventEmitter<boolean>();

  public attachmentsResetSubject$ = new Subject<void>();

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  public dragItemsArea: any[] = [];
  public dragItems: any[] = [];

  public confirmDraggable = false;
  public setDragItems = false;

  public normalDragAndDropForm: FormGroup = new FormGroup({
    background_image: new FormControl(null, Validators.required),
    drop_areas: new FormControl(null, Validators.required),
    drag_options: new FormControl(null, Validators.required)
  });

  private dragItemNumber = 0;
  constructor(
    private dialog: MatDialog,
    private assessmentService: AssessmentService,
    public questionFormService: QuestionFormService
  ) {
    this.attachmentsResetSubject$.subscribe(() => this.questionFormService.resetAttachments());
  }

  ngOnInit(): void {
    if (this.question) {
      this.setForm(this.question);
    }

    this.createDraggableOptions$.subscribe(question => {
      if (question) {
        this.createDraggableOptions(question);
      }
    });
  }

  public onContinue(): void {
    this.dragAndDropDetailsForm.next(this.normalDragAndDropForm);
  }

  public onSetDraggableItems(): void {
    this.setDragItems = false;

    this.normalDragAndDropForm.controls.drag_options.setValue(this.dragItems);

    this.dragItemsArea.forEach(item => {
      this.normalDragAndDropForm.controls.drag_options.setValue(
        this.normalDragAndDropForm.controls.drag_options.value.concat(item.attachments)
      );
    });
    this.dragAndDropDetailsForm.next(this.normalDragAndDropForm);
  }

  public openAreaSelector(): void {
    const areaSelectorComponent = this.dialog.open(AreaSelectorComponent, {
      data: {
        image_background: this.normalDragAndDropForm.controls.background_image.value,
        areas: this.normalDragAndDropForm.controls.drop_areas.value
      }
    });

    areaSelectorComponent.afterClosed().subscribe(value => {
      // AreaSelectorComponent returns:
      // value[0]: drop areas
      // value[1]: background image
      if (value) {
        let areaId = 0;
        value[0].forEach(() => {
          this.dragItemsArea.push({ attachments: [], area_id: areaId });
          areaId++;
        });

        this.normalDragAndDropForm.controls.drop_areas.setValue(value[0]);

        if (value[1] !== this.normalDragAndDropForm.controls.background_image.value) {
          this.normalDragAndDropForm.controls.background_image.setValue(value[1]);
          this.changedBackgroundImage.emit(true);
        }

        this.setDragItems = true;
      }
    });
  }

  public removeArea(array: any[], itemIndex: number): void {
    array.splice(itemIndex, 1);
  }

  public handleFileInputOptions(event: File, type: string, selectedAreas: number[]): void {
    if (!selectedAreas.length && event !== undefined) {
      this.confirmDraggable = true;

      this.dragItems.push({
        attachment_type: type,
        file: event,
        area_id: null,
        drag_item: this.dragItemNumber
      });

      this.dragItemNumber++;
    } else {
      this.confirmDraggable = true;

      selectedAreas.forEach(area => {
        this.dragItemsArea[area].attachments = [{
          attachment_type: type,
          file: event,
          area_id: area,
          drag_item: this.dragItemNumber
        }];

      });

      this.selection.clear();
      this.dragItemNumber++;
    }
  }

  private createDraggableOptions(question: any): void {
    // Areas ids: will be used to the draggable options
    const createdAreas = [];
    question.drop_areas.forEach(area => {
      createdAreas.push(area.id);
    });

    const dragOptionsToCreate = [];
    this.normalDragAndDropForm.controls.drag_options.value.forEach(element => {
      if (dragOptionsToCreate.indexOf(element.drag_item) === (-1)) {
        dragOptionsToCreate.push(element.drag_item);
      }
    });

    // Draggable options
    dragOptionsToCreate.forEach(toCreate => {
      let areaId = null;
      const dragItem = this.normalDragAndDropForm.controls.drag_options.value.filter(item => item.drag_item === toCreate);

      if (dragItem.length) {
        const file = dragItem[0].file;

        dragItem.forEach(item => {
          if (item.area_id !== null) {
            areaId = createdAreas[item.area_id];
          }
        });

        this.assessmentService.addDraggableOption(
          this.assessmentId.toString(), this.topicId.toString(), question.id,
          { area_option: areaId, question_drag_and_drop: question.id }
        ).subscribe(dragOptionCreated => {
          this.questionFormService.saveAttachments(
            this.assessmentId.toString(), file, 'IMAGE',
            { name: 'draggable_option', value: dragOptionCreated.id }, false
          );
        });
      }
    });
  }

  private async getDraggableOptions(): Promise<any> {
    this.assessmentService.getDraggableOptions(this.assessmentId.toString(), this.topicId.toString(), this.question.id)
      .subscribe(async dragOptions => {
        await dragOptions.forEach(async element => {
          // Convert the drag options images objects retrieved from the back-end to files
          if (element.attachments[0]) {
            const file = await this.questionFormService.objectToFile(element.attachments[0]);
            const fileType = element.attachments[0].attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';

            if (element.area_option !== null) {
              this.dragItemsArea.forEach((item, index) => {
                if (element.area_option === item.area_id) {
                  item.attachments = [{
                    attachment_type: fileType,
                    file,
                    area_id: index,
                    drag_item: this.dragItemNumber
                  }];

                  this.dragItemNumber++;
                }
              });
            }
            else {
              this.dragItems.push({
                attachment_type: fileType,
                file,
                area_id: null,
                drag_item: this.dragItemNumber
              });

              this.dragItemNumber++;
            }
            this.confirmDraggable = true;
          }
        });
      });
  }

  private async setForm(question: any): Promise<void> {
    this.question = question;

    this.normalDragAndDropForm.setValue({
      background_image: null,
      drop_areas: this.question.drop_areas,
      drag_options: null
    });

    /// Setting drag_options
    this.question.drop_areas.forEach(area => {
      this.dragItemsArea.push({ attachments: [], area_id: area.id });
    });
    await this.getDraggableOptions();
    this.setDragItems = true;

    // Setting background_image
    let backgroundImage = this.question.attachments.find(
      (i) => i.attachment_type === 'IMAGE' && i.background_image === true
    );
    backgroundImage = await this.questionFormService.objectToFile(backgroundImage);
    this.normalDragAndDropForm.controls.background_image.setValue(backgroundImage);

    if (this.toClone) {
      this.normalDragAndDropForm.markAsDirty();
    }
    this.dragAndDropDetailsForm.next(this.normalDragAndDropForm);
  }
}
