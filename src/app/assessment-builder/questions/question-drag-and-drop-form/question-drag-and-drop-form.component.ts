import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { QuestionFormService } from 'src/app/core/services/question-form.service';
import { AreaSelectorComponent } from '../area-selector/area-selector.component';

interface DialogData {
  topicId?: string;
  order?: any;
  question?: any;
  toClone?: boolean;
  assessmentId?: string;
}

@Component({
  selector: 'app-question-drag-and-drop-form',
  templateUrl: './question-drag-and-drop-form.component.html',
  styleUrls: ['./question-drag-and-drop-form.component.scss']
})
export class QuestionDragAndDropFormComponent implements OnInit {
  public questionsList: any;
  public selectQuestion: boolean;

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  @ViewChild('dragItems') dragItemsElement: ElementRef;

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  public imageAttachment = this.questionFormService.imageAttachment;
  public audioAttachment = this.questionFormService.audioAttachment;

  // making sure that we dont store an new background image on editQuestion, if attachment didn't change
  private changedBackgroundImage = false;

  private dragItemNumber = 0;
  public dragItemsArea: any[] = [];
  public dragItems: any[] = [];

  public confirmDraggable = false;
  public setDragItems = false;
  private changedDragItems = false;

  public attachmentsResetSubject$ = new Subject<void>();

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public dragAndDropForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    order: new FormControl('', Validators.required),
    on_popup: new FormControl(false),
    background_image: new FormControl(null, Validators.required),
    drop_areas: new FormControl(null, Validators.required),
    drag_options: new FormControl(null, Validators.required)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog,
    private assessmentService: AssessmentService,
    public questionFormService: QuestionFormService
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.dragAndDropForm.controls.order.setValue(this.order);
      await this.questionFormService.getQuestionsTypeList('DRAG_AND_DROP').then(res => {
        this.questionsList = res;
      });
    }
    await this.questionFormService.resetAttachments().then(() => this.attachmentsResetSubject$.next());
  }

  private async getDraggableOptions(): Promise<any> {
    this.assessmentService.getDraggableOptions(this.assessmentId.toString(), this.topicId.toString(), this.question.id)
      .subscribe(async dragOptions => {
        await dragOptions.forEach(async element => {
          // Convert the drag options images objects retrieved from the back-end to files
          if (element.attachments[0]) {
            const file = await this.questionFormService.objectToFile(element.attachments[0]);
            const fileType = element.attachments[0].attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';

            if (element.area_option.length > 0) {
              this.dragItemsArea.forEach((item, index) => {
                if (element.area_option.includes(item.area_id)) {
                  item.attachments.push({
                    attachment_type: fileType,
                    file,
                    area_id: index,
                    drag_item: this.dragItemNumber
                  });

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

  public onSetDraggableItems(): void {
    this.setDragItems = false;

    this.dragAndDropForm.controls.drag_options.setValue(this.dragItems);

    this.dragItemsArea.forEach(item => {
      this.dragAndDropForm.controls.drag_options.setValue(
        this.dragAndDropForm.controls.drag_options.value.concat(item.attachments)
      );
    });
  }

  public openAreaSelector(): void {
    const areaSelectorComponent = this.dialog.open(AreaSelectorComponent, {
      data: {
        image_background: this.dragAndDropForm.controls.background_image.value,
        areas: this.dragAndDropForm.controls.drop_areas.value
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

        this.dragAndDropForm.controls.drop_areas.setValue(value[0]);

        if (value[1] !== this.dragAndDropForm.controls.background_image.value) {
          this.dragAndDropForm.controls.background_image.setValue(value[1]);
          this.changedBackgroundImage = true;
        }

        this.setDragItems = true;
      }
    });
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.createQuestionForm().value,
      topicId: this.topicId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && ! this.toClone) {
      this.editDragAndDropQuestion(data);
    } else {
      this.createDragAndDropQuestion(data);
    }
  }

  private createDragAndDropQuestion(data: any): void {
    this.questionFormService.createQuestion(data).then(questionCreated => {
      this.questionFormService.saveAttachments(
        this.assessmentId.toString(), this.dragAndDropForm.controls.background_image.value,
        'IMAGE', { name: 'question', value: questionCreated.id, background_image: true }, true
      );

      this.createDraggableOptions(questionCreated);
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
    });
  }

  private editDragAndDropQuestion(data: any): void {
    this.questionFormService.editQuestion(data).then(question => {
      if (this.changedBackgroundImage) {
        this.questionFormService.updateAttachments(
          this.assessmentId, 'IMAGE', { name: 'question', value: question.id },
          this.dragAndDropForm.controls.background_image.value, true, null, this.question
        );
      }

      this.createDraggableOptions(question);
      this.questionFormService.emitMessage(false, false);
    });
  }

  private createDraggableOptions(question: any): void {
    // Areas ids: will be used to the draggable options
    const createdAreas = [];
    question.drop_areas.forEach(area => {
      createdAreas.push(area.id);
    });

    const dragOptionsToCreate = [];
    this.dragAndDropForm.controls.drag_options.value.forEach(element => {
      if (dragOptionsToCreate.indexOf(element.drag_item) === (-1)) {
        dragOptionsToCreate.push(element.drag_item);
      }
    });

    // Draggable options
    dragOptionsToCreate.forEach(toCreate => {
      const areasId = [];
      const dragItem = this.dragAndDropForm.controls.drag_options.value.filter(item => {
        return item.drag_item === toCreate;
      });

      if (dragItem.length) {
        const file = dragItem[0].file;

        dragItem.forEach(item => {
          if (item.area_id !== null) {
            areasId.push(createdAreas[item.area_id]);
          }
        });

        this.assessmentService.addDraggableOption(
          this.assessmentId.toString(), this.topicId.toString(), question.id,
          { area_option: areasId, question_drag_and_drop: question.id }
        ).subscribe(dragOptionCreated => {
          this.questionFormService.saveAttachments(
            this.assessmentId.toString(), file, 'IMAGE',
            { name: 'draggable_option', value: dragOptionCreated.id }, false
          );
        });
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
        this.dragItemsArea[area].attachments.push({
          attachment_type: type,
          file: event,
          area_id: area,
          drag_item: this.dragItemNumber
        });

        this.changedDragItems = true;
      });

      this.selection.clear();
      this.dragItemNumber++;
    }
  }

  private createQuestionForm(): FormGroup {
    return new FormGroup({
      question_type: new FormControl('DRAG_AND_DROP'),
      title: new FormControl(this.dragAndDropForm.controls.title.value),
      on_popup: new FormControl(this.dragAndDropForm.controls.on_popup.value),
      order: new FormControl(this.dragAndDropForm.controls.order.value),
      drop_areas: new FormControl(this.dragAndDropForm.controls.drop_areas.value)
    });
  }

  public onSelectQuestion(): void {
    const question = this.selectQuestionForm.controls.question.value;
    this.toClone = true;
    this.setForm(question);
  }

  private async setForm(question: any): Promise<void> {
    this.selectQuestion = false;
    this.question = question;

    this.dragAndDropForm.setValue({
      title: this.question.title,
      order: this.toClone ? this.order : this.question.order,
      on_popup: this.question.on_popup,
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
    this.dragAndDropForm.controls.background_image.setValue(backgroundImage);

    // Setting existing attachments
    await this.questionFormService.setExistingAttachments(this.question, this.toClone).then(res => {
      this.imageAttachment = res.image;
      this.audioAttachment = res.audio;
    });

    if (this.toClone) {
      this.dragAndDropForm.markAsDirty();
    }
  }
}
