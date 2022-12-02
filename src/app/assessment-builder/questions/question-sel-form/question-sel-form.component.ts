import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionFormService } from 'src/app/core/services/question-form.service';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { LearningObjective } from 'src/app/core/models/question.model';

interface DialogData {
  topicId?: string;
  question?: any;
  toClone?: boolean;
  assessmentId?: string;
  selQuestionOrder?: any;
  subject?: 'MATH' | 'LITERACY';
  grade?: '1' | '2' | '3';
  subtopicId?: number;
}

@Component({
  selector: 'app-question-sel-form',
  templateUrl: './question-sel-form.component.html',
  styleUrls: ['./question-sel-form.component.scss']
})
export class QuestionSelFormComponent implements OnInit {
  public questionsList: any;
  public selectQuestion: boolean;
  public learningObjectives: LearningObjective[];

  public assessmentId: string;
  public topicId: string;
  public question: any;
  public toClone: boolean;
  public selQuestionOrder: any;
  public grade: string;
  public subject: string;
  public subtopicId: number;

  public selTypes = [
    {id: 'MATH', name: 'Math Self-Efficacy', path: 'mathSelfEfficacy'},
    {id: 'READ', name: 'Read Self-Efficacy', path: 'readSelfEfficacy'},
    {id: 'GROWTH_MINDSET', name: 'Growth Mindset', path: 'growthMindset'}
  ];

  public selectQuestionForm: FormGroup = new FormGroup({
    question: new FormControl(null)
  });

  public selForm: FormGroup = new FormGroup({
    question_type: new FormControl('SEL'),
    title: new FormControl('', [Validators.required]),
    learning_objective: new FormControl(null),
    order: new FormControl('', [Validators.required]),
    sel_type: new FormControl('', [Validators.required])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public questionFormService: QuestionFormService,
    public languageService: LanguageService,
    private assessmentService: AssessmentService
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data?.assessmentId) { this.assessmentId = this.data.assessmentId; }
    if (this.data?.topicId) { this.topicId = this.data.topicId; }
    if (this.data?.question) { this.question = this.data.question; }
    if (this.data?.toClone) { this.toClone = this.data.toClone; }
    if (this.data?.selQuestionOrder !== undefined) {
      this.selQuestionOrder = this.data.selQuestionOrder === 5
        ? this.data.selQuestionOrder
        : this.question && !this.toClone ? this.data.selQuestionOrder : this.data.selQuestionOrder + 1;
    }
    if (this.data?.subject) { this.subject = this.data.subject; }
    if (this.data?.grade) { this.grade = this.data.grade; }
    if (this.data?.subtopicId) {
      this.subtopicId = this.data.subtopicId;
      this.getLearningObjectives();
    }
    if (this.question) {
      this.setForm(this.question);
    } else {
      this.selectQuestion = true;
      this.selForm.controls.order.setValue(this.selQuestionOrder);
      await this.questionFormService.getQuestionsTypeList('SEL').then(res => {
        this.questionsList = res;
      });
    }
    // SEL questions must be at the beginning of the topic
    this.selForm.controls.order.setValidators([Validators.required, Validators.max(this.selQuestionOrder)]);
  }

  public onSelectQuestion(): void {
    const question = this.selectQuestionForm.controls.question.value;
    this.toClone = true;
    this.setForm(question);
  }

  public onSubmit(): void {
    const data = {
      toClone: this.toClone,
      formGroup: this.selForm.value,
      topicId: this.topicId.toString(),
      assessmentId: this.assessmentId.toString(),
      question: this.question
    };

    if (this.question && !this.toClone) {
      this.editSELQuestion(data);
    } else {
      this.createSELQuestion(data);
    }
  }

  private getLearningObjectives(): void {
    const filteringParams = {
      grade: this.grade,
      subject: this.subject,
      subtopic: this.subtopicId,
    };
    this.assessmentService.getLearningObjectives(filteringParams).subscribe((objectives: LearningObjective[]) => {
      this.learningObjectives = objectives;

      if (this.learningObjectives.length) {
        this.selForm.controls.learning_objective.setValidators([Validators.required]);
      } else {
        this.selForm.controls.learning_objective.clearValidators();
      }
      this.selForm.controls.learning_objective.updateValueAndValidity();

      const currentObjective = this.selForm.controls.learning_objective.value;
      if (currentObjective && !this.learningObjectives.find(el => el.code === currentObjective)) {
        this.selForm.controls.learning_objective.setValue(null);
      }
    });
  }

  private createSELQuestion(data?: any): void {
    this.questionFormService.createQuestion(data).then(() => {
      this.questionFormService.emitMessage(this.question === undefined, this.toClone);
    });
  }

  private editSELQuestion(data?: any): void {
    this.questionFormService.editQuestion(data).then(() => {
      this.questionFormService.emitMessage(false, false);
    });
  }

  private async setForm(question: any): Promise<void> {
    this.selectQuestion = false;
    this.question = question;

    this.selForm.setValue({
      question_type: 'SEL',
      title: question.title,
      learning_objective: question.learning_objective?.code ?? null,
      order: this.toClone ? this.selQuestionOrder : question.order,
      sel_type: question.sel_type
    });

    if (this.toClone) {
      this.selForm.markAsDirty();
    }
  }
}
