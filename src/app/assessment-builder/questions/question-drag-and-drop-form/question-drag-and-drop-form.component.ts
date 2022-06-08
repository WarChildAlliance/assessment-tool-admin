import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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
  private changedDragItems = false;

  private dragItemsAttachmentEdit = [];
  public dragItemsArea = [];
  public dragItems = [];

  public confirmDraggable = false;
  public setDragItems = false;
  public alertMessage = '';
  public attachmentsResetSubject$ = new Subject<void>();


  public dragAndDropForm: FormGroup = new FormGroup({
    question_type: new FormControl('DRAG_AND_DROP'),
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    background_image: new FormControl(null, [Validators.required]), // will be saved as FileField in the model on the back
    drop_areas: new FormControl(null, [Validators.required]),
    drag_items: new FormControl(null, [Validators.required])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.order) { this.order = this.data.order; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }

    if (this.question) {
      this.dragAndDropForm.setValue({
        question_type: 'DRAG_AND_DROP',
        title: this.question.title,
        order: this.toClone ? this.order : this.question.order,
        background_image: this.question.background_image, // TODO: convert o obj to file
        drop_areas: this.question.drop_areas,
        drag_items: this.question.drag_items
      });

      await this.setExistingAttachments();

      // TODO: see what comes from the backend
      this.question.drag_items.forEach(attachment => {
        const attObj = {
          image:
            attachment.attachments.find((a) => a.attachment_type === 'IMAGE')
              ?.file || null
        };

        this.dragItemsAttachmentEdit.push(attObj);
      });

      if (this.toClone) {
        this.dragAndDropForm.markAsDirty();
      }
    } else {
      this.dragAndDropForm.setValue({
        question_type: 'DRAG_AND_DROP',
        title: '',
        order: this.order,
        background_image: null,
        drop_areas: null,
        drag_items: null
      });
    }
  }

  // to edit: check if drag item already exists ?
  // delete the ones removed (remove all --> add the new ones?)
  // create new ones for each new image
  public onSetDraggableItems(): void {
    this.setDragItems = false;

    this.dragAndDropForm.controls.drag_items.setValue(this.dragItems);

    this.dragItemsArea.forEach(item => {
      this.dragAndDropForm.controls.drag_items.setValue(
        this.dragAndDropForm.controls.drag_items.value.concat(item.attachments)
      );
    });

    console.log(this.dragAndDropForm.controls.drag_items.value);
  }

  public openDragAndDrop(): void {
    const dragAndDropComponent = this.dialog.open(AreaSelectorComponent);

    dragAndDropComponent.afterClosed().subscribe(value => {
      // AreaSelectorComponent returns:
      // value[0]: drop areas
      // value[1]: background image
      if (value) {
        value[0].forEach(() => {
          this.dragItemsArea.push({ attachments: [] });
        });

        this.dragAndDropForm.controls.drop_areas.setValue(value[0]);
        this.dragAndDropForm.controls.background_image.setValue(value[1]);
        this.setDragItems = true;
      }
    });
  }

  // TODO
  public onSubmit(): void {
    console.log('submit data');
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
      (i) => i.attachment_type === 'IMAGE'
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

  private async objectToFile(attachment): Promise<void> {
    const fileType = attachment.attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';
    const fileName = attachment.file.split('/').at(-1);

    await fetch(attachment.file)
      .then((res) => res.arrayBuffer())
      .then((buf) =>  new File([buf], fileName, {type: fileType}))
      .then((file) => {
        if (attachment.attachment_type === 'IMAGE') {
          this.imageAttachment = file;
        }
        else if (attachment.attachment_type === 'AUDIO') {
          this.audioAttachment = file;
        }
    });
  }

  // i think you don't need it anymore because the form is in a modal dialog
  private resetForm(): void {
    this.attachmentsResetSubject$.next();
    this.dragAndDropForm.setValue({
      question_type: 'DRAG_AND_DROP',
      title: '',
      order: this.order,
      background_image: null,
      drop_areas: null,
      drag_items: null
    });

    this.imageAttachment = null;
    this.audioAttachment = null;

    this.changedAudio = false;
    this.changedImage = false;
  }

  public removeArea(array: any[], itemIndex: number): void {
    array.splice(itemIndex, 1);
  }

  public handleFileInputOptions(event: File, type: string, selectedAreas: number[]): void {

    if (!selectedAreas.length && event !== undefined) {
      this.confirmDraggable = true;
      if (this.question) { this.dragAndDropForm.markAsDirty(); } // really necessary?

      this.dragItems.push({
        attachment_type: type,
        file: event
      });
    } else {
      this.confirmDraggable = true;
      if (this.question) { this.dragAndDropForm.markAsDirty(); } // really necessary?
      selectedAreas.forEach(area => {
        // let overwritePrevious = false;
        // let id = 0;

        // TODO: see what comes from the backend, probably not gonna use
        const overwritePrevious = this.dragItemsAttachmentEdit[area]?.image ? true : false;
        const id = this.question
            ? this.question.options[area].attachments.find(
                (a) => a.attachment_type === 'IMAGE'
              )?.id
            : area;

        this.dragItemsArea[area].attachments.push({
          attachment_type: type,
          file: event,
          overwritePrevious,
          id, // rename to area_id
        });

        this.changedDragItems = true;
        console.log('this.dragItemsArea', this.dragItemsArea);
        this.selection.clear();
      });
    }
  }
}
