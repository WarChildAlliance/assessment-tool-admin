import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { TopicTableData } from 'src/app/core/models/topic-table-data.model';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-topics-list-answers',
  templateUrl: './topics-list-answers.component.html',
  styleUrls: ['./topics-list-answers.component.scss']
})
export class TopicsListAnswersComponent implements OnInit {

  topicsAnswersDataSource: MatTableDataSource<TopicTableData> = new MatTableDataSource([]);
  currentStudentId: string;
  assessmentId: string;

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'Name' },
    { key: 'questions_count', name: 'Number of questions' },
    { key: 'student_tries_count', name: 'Number of tries' },
    { key: 'correct_answers_percentage_first_try', name: 'Answered correctly on first try', type: 'percentage' },
    { key: 'correct_answers_percentage_last_try', name: 'Answered correctly on first try', type: 'percentage' },
    { key: 'last_submission', name: 'Last submission', type: 'date' },
  ];

  public searchableColumns = ['name'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    forkJoin({
      param1: this.route.params.subscribe(params => { this.currentStudentId = params.student_id; }),
      param2: this.route.params.subscribe(params => { this.assessmentId = params.assessment_id; })

    }).pipe(
      catchError(error => of(error))
    ).subscribe(() => {

      this.answerService.getTopicsAnwsers(this.currentStudentId, this.assessmentId).subscribe(topics => {
        this.topicsAnswersDataSource = new MatTableDataSource(topics);
      });
    });
  }

  onOpenDetails(topicId: string): void {
    this.router.navigate(
      [`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${topicId}/questions`]
    );
  }
}
