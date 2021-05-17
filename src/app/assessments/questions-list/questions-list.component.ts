import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  private assessmentId;
  private topicId;

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'title', value: 'Title' },
    { key: 'question_type', value: 'Question type' },
    { key: 'order', value: 'Order' },
    { key: 'has_attachment', value: 'Attachments' },
    { key: 'correct_answers_percentage', value: 'Overall correct answers percentage'}
  ];

  public searchableColumns = ['title', 'question_type'];

  public questionsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public selectedQuestions: any[] = [];

  constructor(private assessmentService: AssessmentService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    forkJoin({
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id }),
      param4: this.route.params.subscribe(params => { this.topicId = params.topic_id })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {

      this.assessmentService.getTopicQuestions(this.assessmentId, this.topicId).subscribe((questionsList) => {
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
