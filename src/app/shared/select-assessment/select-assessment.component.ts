import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { AssessmentDashboard } from 'src/app/core/models/assessment-dashboard.model';
import { QuestionSetDashboard } from 'src/app/core/models/question-set-dashboard.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-select-assessment',
  templateUrl: './select-assessment.component.html',
  styleUrls: ['./select-assessment.component.scss']
})
export class SelectAssessmentComponent implements OnInit {

  @Input() questionSetSelectionEnabled: boolean;
  @Input() multiple: boolean;
  @Input() displayNonEvaluated: boolean;

  @Output() assessmentSelection = new EventEmitter<AssessmentDashboard>();
  @Output() questionSetSelection = new EventEmitter<{assessmentId: string; questionSet: QuestionSetDashboard}>();

  public assessmentsList: AssessmentDashboard[];
  public questionSetsList: QuestionSetDashboard[];

  public selectedAssessment: AssessmentDashboard;
  public selectedAssessmentArr: AssessmentDashboard[];
  public selected: AssessmentDashboard[] = [];
  public selectedQuestionSet: QuestionSetDashboard;

  private assessmentId: string;
  private firstQuestionSetRequest = true;

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.assessmentService.completeAssessmentsList.pipe(first()).subscribe(assessmentsList => {
      this.assessmentsList = assessmentsList.filter(assessment => assessment.archived !== true);
      this.selectedAssessment = this.assessmentsList.find(el => el.started);
      this.selectedAssessmentArr = this.assessmentsList.filter(el => el.started).slice(0, 1);

      if (this.questionSetSelectionEnabled) {
        if (this.selectedAssessment){
          this.assessmentId = this.selectedAssessment.id;
          this.getQuestionSets(this.assessmentId);
        } else {
          this.questionSetSelection.emit(null);
        }
      } else {
        this.assessmentSelection.emit(this.selectedAssessment);
      }
    });
  }

  public selectAssessment(assessment: AssessmentDashboard): void {
    this.selectedAssessment = assessment;
    if (this.questionSetSelectionEnabled) {
      this.assessmentId = assessment.id;
      this.getQuestionSets(assessment.id);
    } else {
      this.assessmentSelection.emit(assessment);
    }
  }

  public selectQuestionSet(questionSet: QuestionSetDashboard): void {
    this.selectedQuestionSet = questionSet;
    this.questionSetSelection.emit({assessmentId: this.assessmentId, questionSet});
  }

  private getQuestionSets(assessmentId: string): void{
    this.assessmentService.getQuestionSetsListForDashboard(assessmentId).subscribe(questionSets => {
      this.questionSetsList = questionSets;

      if (this.firstQuestionSetRequest) {
        this.selectedQuestionSet = this.questionSetsList.find(el => el.started);
        this.questionSetSelection.emit({assessmentId: this.assessmentId, questionSet: this.selectedQuestionSet});
        this.firstQuestionSetRequest = false;
      }
    });
  }
}
