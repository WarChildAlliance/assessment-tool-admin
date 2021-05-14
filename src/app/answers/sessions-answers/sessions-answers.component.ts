import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-sessions-answers',
  templateUrl: './sessions-answers.component.html',
  styleUrls: ['./sessions-answers.component.scss']
})
export class SessionsAnswersComponent implements OnInit {

  sessionsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  currentStudentId: string;

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'start_date', value: 'Start date' },
    { key: 'end_date', value: 'End date' },
    { key: 'answered_questions_count', value: 'Number of answered questions' },
    { key: 'completed_topics_count', value: 'Number of completed topics' },
    { key: 'correct_answers_percentage', value: 'Percentage of correct answers' }
  ];

  public searchableColumns = ['duration', 'date'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    this.currentStudentId = this.route.snapshot.paramMap.get('student_id');
    
    this.answerService.getSessionsAnswers(this.currentStudentId).subscribe(sessionsAnswers => {
      this.sessionsAnswersDataSource = new MatTableDataSource(sessionsAnswers);
    });
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments`, {session_id: id}]);
  }
}
