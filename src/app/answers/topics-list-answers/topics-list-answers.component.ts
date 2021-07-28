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
    { key: 'topic_name', name: 'Name' },
    { key: 'total_questions_count', name: 'Number of questions' },
    { key: 'answered_questions_count', name: 'Number of answered questions' },
    { key: 'correct_answers_percentage', name: 'Answered correctly', type: 'percentage' },
    { key: 'start_date', name: 'Last submission', type: 'date', sorting: 'desc' },
    { key: 'evaluated', name: 'Evaluated', type: 'boolean' },
    { key: 'complete', name: 'Completed', type: 'boolean' },
  ];

  public searchableColumns = ['topic_name', 'complete'];

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
