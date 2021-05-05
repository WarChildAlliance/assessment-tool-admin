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

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'duration', value: 'Duration' },
    { key: 'date', value: 'Date' }
  ];

  public searchableColumns = ['duration', 'date'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    this.answerService.getSessionsAnswers(this.route.snapshot.paramMap.get('id')).subscribe(sessionsAnswers => {
      
      this.sessionsAnswersDataSource = new MatTableDataSource(sessionsAnswers);
    });
  }

  onOpenDetails(id: string): void {
    // this.router.navigate([`/students/${id}`]);
  }

}
