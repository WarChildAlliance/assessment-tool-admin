import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { QuestionTableData } from 'src/app/core/models/question-table-data.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  private assessmentId: string;
  private topicId: string;

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'question_type', name: 'Question type' },
    { key: 'order', name: 'Order', sorting: 'asc' },
    { key: 'has_attachment', name: 'Attachment', type: 'boolean' },
    { key: 'correct_answers_percentage_first', name: 'Total correct answers on students\' first try', type: 'percentage' },
    { key: 'correct_answers_percentage_last', name: 'Total correct answers on students\' last try', type: 'percentage' }
  ];

  public questionsDataSource: MatTableDataSource<QuestionTableData> = new MatTableDataSource([]);
  public selectedQuestions: any[] = [];

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.assessmentId = params.get('assessment_id');
        this.topicId = params.get('topic_id');

        return this.assessmentService.getTopicQuestions(this.assessmentId, this.topicId);
      })
    ).subscribe((questionsList) => {
      this.questionsDataSource = new MatTableDataSource(questionsList);
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: any[]): void {
    this.selectedQuestions = newSelection;
  }

  onOpenDetails(id: string): void {
    // this.router.navigate([`/assessments/${this.assessmentId}/topics/${this.topicId}/questions/${id}`]);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }
}
