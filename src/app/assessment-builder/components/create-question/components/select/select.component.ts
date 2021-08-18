import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() assessmentId: number;
  @Input() topicId: number;
  @Input() question = null;
  @Input() questionsCount = 0;

  public amountOptions = [0, 1];
  public options = [];

  public imageAttachment = null;
  public audioAttachment = null;

  public selectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
    display: new FormControl('GRID', [Validators.required]),
    multiple: new FormControl(false)
  });

  constructor(
    private assessmentService: AssessmentService,
    private alertService: AlertService
    ) { }

  ngOnInit(): void {
    if (this.question) {
      const q = this.question;
      this.selectForm.setValue({title: q.title, order: q.order, display: q.display_type ? q.display_type : 'GRID', multiple: q.multiple});
      this.options = q.options.map( element => {
        return {option: {value: element.value, valid: element.valid ? true : false},
            audio: (element.attachments.find( a => a.attachment_type === 'AUDIO'))?.file,
            image: (element.attachments.find( a => a.attachment_type === 'IMAGE'))?.file,
        };
      });
    } else {
      this.selectForm.patchValue({
        order: this.questionsCount + 1
      });
    }
  }

  createOption(): void {
    this.amountOptions.push(this.options.length);
    if (this.question) {
      this.options.push({valid: false, value: ''});
    }
  }

  addOption(event, index): void {
    const optionValue = event.option.value;
    // TODO should be temporary until attachments are resolved
    const option = {option: {value: optionValue.value, valid: optionValue.valid ? true : false},
    image: event.image, audio: event.audio};

    if (this.options.length < index) {
      this.options.push(option);
    } else {
      this.options[index] = option;
    }
  }


  onSave(): void {
    if (this.options.length < 2) {
      this.alertService.error('You need at least 2 options for a select question');
    } else {
      const newQuestion = {
        question_type: 'SELECT',
        title: this.selectForm.value.title,
        order: this.selectForm.value.order,
        display_type: this.selectForm.value.display,
        multiple: this.selectForm.value.multiple ? true : false,
        options: this.options.map(o => o.option)
      };
      const hasAttachment = this.options.find( o => {
        return o.audioAttachment !== null || o.imageAttachment !== null;
    });

      if (this.question) {
        this.updateQuestion(newQuestion, hasAttachment);
      } else {
        this.createQuestion(newQuestion, hasAttachment);
      }
    }
  }

  handleFileInput(event, type): void {
    if (type === 'IMAGE'){
      this.imageAttachment = event.target.files[0];
    } else if (type === 'AUDIO') {
      this.audioAttachment = event.target.files[0];
    }
  }
  createQuestion(newQuestion, hasAttachment): void {
    this.assessmentService.createQuestion(newQuestion, this.topicId.toString(),
    this.assessmentId.toString()).subscribe((res) => {
      this.saveAttachments(hasAttachment, res);
    });
  }

  updateQuestion(newQuestion, hasAttachment): void {
    this.assessmentService.editQuestion(this.assessmentId.toString(), this.topicId.toString(),
      this.question.id,  newQuestion).subscribe(res => {
        this.saveAttachments(hasAttachment, res);
    });
  }

  saveAttachments(hasAttachment, question): void {
    if (hasAttachment) {
      this.options.forEach( (o, index) => {
        if (o.image) {
          this.assessmentService.addAttachments(this.assessmentId.toString(), o.image,
            'IMAGE', {name: 'select_option', value: question.options[index].id}).subscribe();
        }
        if (o.audio) {
          this.assessmentService.addAttachments(this.assessmentId.toString(), o.audio,
            'AUDIO', {name: 'select_option', value: question.options[index].id}).subscribe();
        }
      });
    }
  }


}
