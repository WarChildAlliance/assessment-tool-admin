import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
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

  public assessmentId: string;
  public topicId: string;
  public order: any;
  public question: any;
  public toClone: boolean;

  @Output() questionCreatedEvent = new EventEmitter<boolean>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  @ViewChild('dragItems') dragItemsElement: ElementRef;

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  public imageAttachment = null;
  public audioAttachment = null;

  // making sure that we dont store an new attachment on editQuestion, if attachment didn't change
  private changedAudio = false;
  private changedImage = false;
  private changedBackgroundImage = false;

  private dragItemNumber = 0;
  public dragItemsArea: any[] = [];
  public dragItems: any[] = [];

  public confirmDraggable = false;
  public setDragItems = false;
  private changedDragItems = false;

  private alertMessage = '';
  public attachmentsResetSubject$ = new Subject<void>();

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
    private translateService: TranslateService,
    private alertService: AlertService
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }

    if (this.question) {
      this.dragAndDropForm.setValue({
        title: this.question.title,
        order: this.toClone ? this.order : this.question.order,
        on_popup: this.question.on_popup,
        background_image: null,
        drop_areas: this.question.drop_areas,
        drag_options: null
      });

      // Setting background_image and drag_options
      this.question.drop_areas.forEach(area => {
        this.dragItemsArea.push({ attachments: [], area_id: area.id });
      });

      const backgroundImage = this.question.attachments.find(
        (i) => i.attachment_type === 'IMAGE' && i.background_image === true
      );

      await this.getDraggableOptions();
      this.setDragItems = true;

      await this.objectToFile(backgroundImage);
      await this.setExistingAttachments();

      if (this.toClone) {
        this.dragAndDropForm.markAsDirty();
      }
    } else {
      this.dragAndDropForm.setValue({
        title: '',
        order: this.order,
        on_popup: false,
        background_image: null,
        drop_areas: null,
        drag_options: null
      });
    }
  }

  private async getDraggableOptions(): Promise<any> {
    this.assessmentService.getDraggableOptions(this.assessmentId.toString(), this.topicId.toString(), this.question.id)
      .subscribe(async dragOptions => {
        await this.objectToFile(dragOptions, true);
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
    if (this.toClone) {
      this.createQuestion();
      this.alertMessage =  this.translateService.instant('assessmentBuilder.questions.questionCloneSuccess');
    } else if (this.question && !this.toClone) {
      this.editQuestion();
      this.alertMessage = this.translateService.instant('assessmentBuilder.questions.questionUpdateSuccess');
    } else {
      this.createQuestion();
      this.alertMessage = this.translateService.instant('assessmentBuilder.questions.questionCreateSuccess');
    }
  }

  private createQuestion(): void {
    const data = this.createQuestionForm();

    this.assessmentService.createQuestion(data.value,
      this.topicId.toString(),
      this.assessmentId.toString()
    ).subscribe(questionCreated => {
      this.saveAttachments(
        this.assessmentId.toString(), this.dragAndDropForm.controls.background_image.value,
        'IMAGE', { name: 'question', value: questionCreated.id, background_image: true }, true
      );

      if (this.changedImage) {
        this.saveAttachments(this.assessmentId.toString(), this.imageAttachment, 'IMAGE',
        { name: 'question', value: questionCreated.id }, false);
      }
      if (this.changedAudio) {
        this.saveAttachments(this.assessmentId.toString(), this.audioAttachment, 'AUDIO',
        { name: 'question', value: questionCreated.id }, false);
      }

      // Created Areas ids: will be used to create the draggable options
      const createdAreas = [];
      questionCreated.drop_areas.forEach(area => {
        createdAreas.push(area.id);
      });

      const dragOptionsToCreate = [];
      this.dragAndDropForm.controls.drag_options.value.forEach(element => {
        if (dragOptionsToCreate.indexOf(element.drag_item) === (-1)) {
          dragOptionsToCreate.push(element.drag_item);
        }
      });

      // Creating draggable options
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

          this.assessmentService.addDraggableOption(this.assessmentId.toString(), this.topicId.toString(), questionCreated.id,
            { area_option: areasId, question_drag_and_drop: questionCreated.id }).subscribe(dragOptionCreated => {

              this.saveAttachments(
                this.assessmentId.toString(), file, 'IMAGE',
                { name: 'draggable_option', value: dragOptionCreated.id }, false
              );
          });
        }
      });

      this.alertService.success(this.alertMessage);
      this.questionCreatedEvent.emit(true);
    });
  }

  private editQuestion(): void {
    const data = this.createQuestionForm();

    this.assessmentService.editQuestion(
      this.assessmentId.toString(),
      this.topicId.toString(),
      this.question.id.toString(),
      data.value
    ).subscribe(question => {
      if (this.changedBackgroundImage) {
        this.updateQuestionAttachments('IMAGE', { name: 'question', value: question.id },
        this.dragAndDropForm.controls.background_image.value, true);
      }
      if (this.changedImage) {
        this.updateQuestionAttachments('IMAGE', { name: 'question', value: question.id }, this.imageAttachment, false);
      }
      if (this.changedAudio) {
        this.updateQuestionAttachments('AUDIO', { name: 'question', value: question.id }, this.audioAttachment, false);
      }

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

          this.assessmentService.addDraggableOption(this.assessmentId.toString(), this.topicId.toString(), question.id,
            { area_option: areasId, question_drag_and_drop: question.id }).subscribe(dragOptionCreated => {
              this.saveAttachments(
                this.assessmentId.toString(), file, 'IMAGE',
                { name: 'draggable_option', value: dragOptionCreated.id }, false
              );
          });
        }
      });
      this.alertService.success(this.alertMessage);
      this.questionCreatedEvent.emit(true);
    });
  }

  private saveAttachments(assessmentId: string, attachment, type: string, obj, backgroundImage: boolean): void {
    this.assessmentService
      .addAttachments(assessmentId, attachment, type, obj, backgroundImage)
      .subscribe(() => {
        this.alertService.success(this.alertMessage);
      });
  }

  private updateQuestionAttachments(type: string, obj: any, attachment: any, backgroundImage: boolean): void {
    const file = this.question.attachments.find(a => a.attachment_type === type && a.background_image === backgroundImage);
    if (file) {
      this.assessmentService.updateAttachments(this.assessmentId, attachment, type, file.id).subscribe();
    } else {
      this.saveAttachments(this.assessmentId, attachment, type, obj, backgroundImage);
    }
  }

  public onNewImageAttachment(event: File): void {
    this.changedImage = true;
    this.imageAttachment = event;
  }

  public onNewAudioAttachment(event: File): void {
    this.changedAudio = true;
    this.audioAttachment = event;
  }

  private async setExistingAttachments(): Promise<void> {
    const image = this.question.attachments.find(
      (i) => i.attachment_type === 'IMAGE' && i.background_image === false
    );
    const audio = this.question.attachments.find(
      (a) => a.attachment_type === 'AUDIO'
    );

    if (this.toClone) {
      if (image) {
        await this.objectToFile(image);
      }
      if (audio) {
        await this.objectToFile(audio);
      }
    } else {
      if (image) {
        this.imageAttachment = image;
        this.imageAttachment.name = image ? image.file.split('/').at(-1) : null;
      }
      if (audio) {
        this.audioAttachment = audio;
        this.audioAttachment.name = audio ? audio.file.split('/').at(-1) : null;
      }
    }
  }

  private async objectToFile(attachment, dragOptions?: boolean): Promise<void> {
    // To convert the drag options images objects retrieved from the back-end to files
    if (dragOptions) {
      await attachment.forEach(async element => {
        const fileType = element.attachments[0].attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';
        const fileName = element.attachments[0].file.split('/').at(-1);

        await fetch(element.attachments[0].file)
          .then((res) => res.arrayBuffer())
          .then((buf) => new File([buf], fileName, { type: fileType }))
          .then((file) => {
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
          });
      });

      this.confirmDraggable = true;
    }
    // Convert question attachments and background_image objects retrieved from the back-end to files
    else {
      const fileType = attachment.attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';
      const fileName = attachment.file.split('/').at(-1);

      await fetch(attachment.file)
        .then((res) => res.arrayBuffer())
        .then((buf) => new File([buf], fileName, { type: fileType }))
        .then((file) => {
          if (attachment.background_image === true) {
            this.dragAndDropForm.controls.background_image.setValue(file);
          }
          else if (attachment.attachment_type === 'IMAGE') {
            this.imageAttachment = file;
          }
          else if (attachment.attachment_type === 'AUDIO') {
            this.audioAttachment = file;
          }
        });
    }
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
}
