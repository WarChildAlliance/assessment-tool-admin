import { Component, OnInit, Input } from '@angular/core';
import { Assessment } from '../../core/models/assessment.model';
import { QuestionSet } from '../../core/models/question-set.model';
import { AssessmentService } from '../../core/services/assessment.service';

@Component({
  selector: 'app-table-row-details',
  templateUrl: './table-row-details.component.html',
  styleUrls: ['./table-row-details.component.scss']
})
export class TableRowDetailsComponent implements OnInit {

  @Input() config: string;
  @Input() data: Assessment;

  public questionSets: QuestionSet[];
  public questionSetIndex = 0;
  public questionIndex = 0;

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    if (this.config === 'library') {
      this.data.question_sets.forEach(questionSet => {
        this.assessmentService.getQuestionSetQuestions(
          this.data.id.toString(), questionSet.id.toString()).subscribe(questions => {
            questionSet.questions = questions;
          });
      });
      this.questionSets = this.data.question_sets;
    }
  }
}
