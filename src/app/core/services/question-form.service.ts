import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './alert.service';
import { AssessmentService } from './assessment.service';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionFormService {

  public operatorTypes = [
    { id: 'ADDITION', path: 'addition' },
    { id: 'SUBTRACTION', path: 'substraction' },
    { id: 'DIVISION', path: 'division' },
    { id: 'MULTIPLICATION', path: 'multiplication' }
  ];

  private fileAttachment: File;
  private alertMessage = '';

  // Making sure that we dont store an new attachment on editQuestion, if attachment didn't change
  private changedAudio = false;
  private changedImage = false;

  // Handle image and audio attachments
  private imageAttachmentFile = null;
  private audioAttachmentFile = null;

  constructor(
    private assessmentService: AssessmentService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private utilitiesService: UtilitiesService
  ) { }

  get imageAttachment(): File {
    return this.imageAttachmentFile;
  }

  set imageAttachment(event: File) {
    this.imageAttachmentFile = event;
    this.changedImage = event ? true : false;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get audioAttachment(): File {
    return this.audioAttachmentFile;
  }

  set audioAttachment(event: File) {
    this.audioAttachmentFile = event;
    this.changedAudio = event ? true : false;
  }

  public validateCalcul = (form: FormGroup): any => {
    const firstValue = form.get('first_value');
    const secondValue = form.get('second_value');
    const operator = form.get('operator');
    if (!firstValue.value || !secondValue.value) {
      return;
    }
    if (operator.value) {
      let answer = 0;
      if (operator.value === 'ADDITION') {
        answer = firstValue.value + secondValue.value;
      } else if (operator.value === 'SUBTRACTION') {
        answer = firstValue.value - secondValue.value;
      } else if (operator.value === 'DIVISION') {
        answer = firstValue.value / secondValue.value;
      } else {
        answer = firstValue.value * secondValue.value;
      }

      firstValue.setErrors(null);
      secondValue.setErrors(null);

      if (!Number.isInteger(answer) || answer < 0) {
        firstValue.setErrors({ invalidCalcul: true });
        secondValue.setErrors({ invalidCalcul: true });
      }
    }
  };

  // Convert attachments objects retrieved from the back-end to files
  public async objectToFile(attachment): Promise<File> {
    const fileType = attachment.attachment_type === 'IMAGE' ? 'image/png' : 'audio/wav';
    const fileName = attachment.file.split('/').at(-1);

    await fetch(this.utilitiesService.getSource(attachment.file))
      .then((res) => res.arrayBuffer())
      .then((buf) =>  new File([buf], fileName, {type: fileType}))
      .then((file) => {
        this.fileAttachment = file;
    });

    return this.fileAttachment;
  }

  public async setExistingAttachments(question: any, toClone: boolean): Promise<{ image: any; audio: any }> {
    const image = question.attachments.find(
      (i) => i.attachment_type === 'IMAGE' && i.background_image === false
    );
    const audio = question.attachments.find(
      (a) => a.attachment_type === 'AUDIO'
    );

    if (toClone) {
      if (image) {
        this.imageAttachmentFile = await this.objectToFile(image);
      }
      if (audio) {
        this.audioAttachmentFile = await this.objectToFile(audio);
      }
    } else {
      if (image) {
        this.imageAttachmentFile = image;
        this.imageAttachmentFile.name = image ? image.file.split('/').at(-1) : null;
      }
      if (audio) {
        this.audioAttachmentFile = audio;
        this.audioAttachmentFile.name = audio ? audio.file.split('/').at(-1) : null;
      }
    }
    return { image: this.imageAttachmentFile, audio: this.audioAttachmentFile };
  }

  public saveAttachments(assessmentId: string, attachment: any, type: string, obj: any, backgroundImage: boolean): void {
    this.assessmentService.addAttachments(assessmentId, attachment, type, obj, backgroundImage).subscribe();
  }

  public updateAttachments(
    assessmentId: string, type: string, obj: any, attachment: any, backgroundImage: boolean, fileIn?: any, question?: any
  ): void {
    const file = fileIn ?? question.attachments.find(a => a.attachment_type === type && a.background_image === backgroundImage);

    if (file) {
      this.assessmentService.updateAttachments(assessmentId, attachment, type, file.id).subscribe();
    } else {
      this.saveAttachments(assessmentId, attachment, type, obj, backgroundImage);
    }
  }

  // Creates question, saves image and audio attachments and return question created
  public createQuestion(data: any): Promise<any> {
    return new Promise(resolve => {
      this.assessmentService.createQuestion(data.formGroup, data.questionSetId, data.assessmentId)
      .subscribe((res) => {
        if (this.imageAttachment) {
          this.saveAttachments(
            data.assessmentId, this.imageAttachment, 'IMAGE',
            { name: 'question', value: res.id }, false
          );
        }
        if (this.audioAttachment) {
          this.saveAttachments(
            data.assessmentId, this.audioAttachment, 'AUDIO',
            { name: 'question', value: res.id }, false
          );
        }
        resolve(res);
      });
    });
  }

  // Edits question, saves image and audio attachments (if changed) and return question edited
  public editQuestion(data: any): Promise<any> {
    return new Promise (resolve => {
      this.assessmentService.editQuestion(data.assessmentId, data.questionSetId, data.question.id, data.formGroup)
      .subscribe(res => {
        if (this.changedImage) {
           if (this.imageAttachment) {
             this.updateAttachments(
               data.assessmentId, 'IMAGE',
               {name: 'question', value: res.id},
               this.imageAttachment, false, null, data.question
             );
           } else {
              const attachment = data.question.attachments.find(a => a.attachment_type === 'IMAGE' && a.background_image === false);
              this.assessmentService.deleteAttachments(data.assessmentId, attachment.id).subscribe();
           }
        }
        if (this.changedAudio) {
          if (this.audioAttachment) {
            this.updateAttachments(
              data.assessmentId, 'AUDIO',
              {name: 'question', value: res.id},
              this.audioAttachment, false, null, data.question
            );
          } else {
            const attachment = data.question.attachments.find(a => a.attachment_type === 'AUDIO' && a.background_image === false);
            this.assessmentService.deleteAttachments(data.assessmentId, attachment.id).subscribe();
          }
        }
        resolve(res);
      });
    });
  }

  public emitMessage(question: boolean, clone: boolean): void {
    if (question) {
      this.alertMessage = this.translateService.instant('general.createSuccess', {
        type: this.translateService.instant('general.question')
      });
    } else if (clone) {
      this.alertMessage = this.translateService.instant('assessmentBuilder.questions.questionCloneSuccess');
    } else {
      this.alertMessage = this.translateService.instant('general.editSuccess', {
        type: this.translateService.instant('general.question')
      });
    }

    this.alertService.success(this.alertMessage);
  }

  public async resetAttachments(): Promise<void> {
    return new Promise(resolve => {
      this.audioAttachmentFile = null;
      this.imageAttachmentFile = null;
      this.changedAudio = false;
      this.changedImage = false;
      resolve();
    });
  }

  // Gets all questions of certain type accessible to the logged in supervisor
  public getQuestionsTypeList(type: string): Promise<any> {
    return new Promise(resolve => {
      this.assessmentService.getQuestionsTypeList(type).subscribe(questions => {
        resolve(questions);
      });
    });
  }
}
