import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { Question } from 'src/app/core/models/answers/question.model';
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
    { key: 'attachment_icon', name: 'Attachment', type: 'icon' },
    { key: 'correct_answers_percentage', name: 'Overall correct answers percentage', type: 'percentage' }
  ];

  public searchableColumns = ['title', 'question_type'];

  public questionsDataSource: MatTableDataSource<Question> = new MatTableDataSource([]);
  public selectedQuestions: any[] = [];

  constructor(private assessmentService: AssessmentService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    forkJoin({
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id }),
      param4: this.route.params.subscribe(params => { this.topicId = params.topic_id })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {

      this.assessmentService.getTopicQuestions(this.assessmentId, this.topicId).subscribe((questionsList) => {
        questionsList.forEach((question: Question) => {
          question.has_attachment ? question.attachment_icon = 'attachment' : question.attachment_icon = null;
        })
        this.questionsDataSource = new MatTableDataSource(questionsList);
      });
    })
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: any[]): void {
    this.selectedQuestions = newSelection;
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${this.assessmentId}/topics/${this.topicId}/questions/${id}`]);
  }

  deleteSelection(): void {
    console.log('DEL', this.selectedQuestions);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }
}
