import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionFormService } from 'src/app/core/services/question-form.service';

@Component({
  selector: 'app-customized-drag-and-drop-form',
  templateUrl: './customized-drag-and-drop-form.component.html',
  styleUrls: ['./customized-drag-and-drop-form.component.scss']
})
export class CustomizedDragAndDropFormComponent implements OnInit {
  @Input() question: any;
  @Input() toClone: boolean;

  @Output() dragAndDropDetailsForm = new EventEmitter<any>();

  public shapes = [
    { type: 'pencil', color: true },
    { type: 'fruit', color: false },
    { type: 'ballon', color: true },
    { type: 'button', color: true },
    { type: 'socks', color: true },
    { type: 'paint', color: true },
    { type: 'bug', color: false },
  ];

  public styles = {
    color: [
      'red', 'light_green', 'dark_green', 'yellow',
      'orange', 'light_blue', 'dark_blue', 'pink', 'purple'
    ],
    bug: ['caterpillar', 'ant', 'butterfly', 'centipede', 'fly'],
    fruit: ['apple', 'banana', 'watermelon', 'orange']
  };

  public selectedStyle = 'color';
  public stylesList = this.styles.color;

  public customizedDragAndDropForm: FormGroup = new FormGroup({
    first_value: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
    first_style: new FormControl('', Validators.required),
    second_value: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
    second_style: new FormControl('', Validators.required),
    operator: new FormControl('', [Validators.required]),
    shape: new FormControl('', [Validators.required]),
  }, this.questionFormService.validateCalcul);

  constructor(
    public questionFormService: QuestionFormService,
  ) { }

  ngOnInit(): void {
    if (this.question) {
      this.setForm(this.question);
    }
  }

  public onSetShape(selected: any): void {
    selected = selected.toLowerCase();
    if (selected !== 'bug' && selected !== 'fruit') {
      selected = 'color';
    }
    this.stylesList = this.styles[selected];
    this.selectedStyle = selected;

    // Clear selected style value
    this.customizedDragAndDropForm.controls.first_style.reset();
    this.customizedDragAndDropForm.controls.second_style.reset();
  }

  public onContinue(): void {
    this.dragAndDropDetailsForm.next(this.customizedDragAndDropForm);
  }

  private async setForm(question: any): Promise<void> {
    this.question = question;

    this.customizedDragAndDropForm.setValue({
      first_value: this.question.first_value,
      first_style: this.question.first_style,
      second_value: this.question.second_value,
      second_style: this.question.second_style,
      operator: this.question.operator,
      shape: this.question.shape,
    });

    if (this.toClone) {
      this.customizedDragAndDropForm.markAsDirty();
    }
    this.dragAndDropDetailsForm.next(this.customizedDragAndDropForm);
  }
}
