import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-sessions-answers',
  templateUrl: './sessions-answers.component.html',
  styleUrls: ['./sessions-answers.component.scss']
})
export class SessionsAnswersComponent implements OnInit {

  sessionsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  currentStudentId: string;

  public displayedColumns: TableColumn[] = [
    { key: 'start_date', name: 'Start date', type: 'date', sorting:"desc" },
    { key: 'end_date', name: 'End date', type: 'date' },
    { key: 'completed_topics_count', name: 'Number of completed topics' },
    { key: 'answered_questions_count', name: 'Number of answered questions' },
    { key: 'correctly_answered_questions_count', name: 'Number of correctly answered questions' },
    { key: 'correct_answers_percentage', name: 'Percentage of correct answers', type: 'percentage' }
  ];

  public searchableColumns = ['duration', 'date'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentStudentId = params.student_id;

      this.answerService.getSessionsAnswers(this.currentStudentId).subscribe(sessionsAnswers => {
        this.sessionsAnswersDataSource = new MatTableDataSource(sessionsAnswers);
      });
    })
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments`], { queryParams: { session_id: id } });
  }
}
