import { Component, OnInit, Input } from '@angular/core';
import { QuestionSet } from '../../core/models/question-set.model';
import { AssessmentService } from '../../core/services/assessment.service';

@Component({
  selector: 'app-table-row-details',
  templateUrl: './table-row-details.component.html',
  styleUrls: ['./table-row-details.component.scss']
})
export class TableRowDetailsComponent implements OnInit {

  @Input() config: string;
  @Input() data: any;

  public questionSets: QuestionSet[];
  public questionSetIndex = 0;
  public questionIndex = 0;
  public assessmentId: string;
  public loading = true;

  constructor(private assessmentService: AssessmentService) { }

  async ngOnInit(): Promise<void> {
    if (this.config === 'library') {
      if (this.data?.id) { this.assessmentId = this.data?.id; }
      for await (const questionSet of this.data.question_sets) {
        questionSet.questions = await this.getQuestions(this.assessmentId?.toString(), questionSet.id.toString());
      }
      this.questionSets = this.data.question_sets;
    } else if (this.config === 'questions') {
      this.questionSets = [{
        id: this.data?.question_set,
        questions: []
      }];
      if (this.data?.assessment) { this.assessmentId = this.data?.assessment; }

      this.questionSets[this.questionSetIndex].questions.push(await
        this.assessmentService.getQuestionDetails(
          this.assessmentId.toString(),
          this.questionSets[this.questionSetIndex].id.toString(),
          this.data?.id
        ).toPromise());
    }
    this.loading = false;
  }

  public updateQuestionIndex(action: string): void {
    if (action === 'before') {
      this.questionIndex -= this.questionIndex ? 1 : 0;
    } else {
      this.questionIndex += this.questionSets[this.questionSetIndex]?.questions.length > this.questionIndex + 1
        ? 1 : 0;
    }
  }

  public updateQuestionSetIndex(index: number): void {
    this.questionSetIndex = index;
    this.questionIndex = 0;
  }

  private getQuestions(assessmentId: string, questionSetId: string): Promise<any> {
    return this.assessmentService.getQuestionsList(assessmentId, questionSetId).toPromise();
  }
}
