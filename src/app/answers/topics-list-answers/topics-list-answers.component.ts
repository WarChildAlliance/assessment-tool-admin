import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-topics-list-answers',
  templateUrl: './topics-list-answers.component.html',
  styleUrls: ['./topics-list-answers.component.scss']
})
export class TopicsListAnswersComponent implements OnInit {

  topicsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  currentStudentId: string;
  assessmentId: string;
  sessionId: string;

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'topic_name', value: 'Name' },
    { key: 'total_questions_count', value: 'Number of questions' },
    { key: 'answered_questions_count', value: 'Number of questions answered by the student' },
    { key: 'correct_answers_percentage', value: 'Percentage of correct answers' },
    { key: 'complete', value: 'Completed' },
  ];

  public searchableColumns = ['topic_name', 'complete'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    this.currentStudentId = this.route.snapshot.paramMap.get('student_id');
    this.assessmentId = this.route.snapshot.paramMap.get('assessment_id');
    this.sessionId = this.route.snapshot.paramMap.get('session_id');

    this.answerService.getTopicsAnwsers(this.currentStudentId, this.assessmentId, this.sessionId).subscribe(topics => {
      this.topicsAnswersDataSource = new MatTableDataSource(topics)
    });
  }

  onOpenDetails(topicId: string): void {
    let navigateUrl: any[] = [`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${topicId}/questions`];
    if (this.sessionId) {navigateUrl.push({session_id: this.sessionId})} 

    this.router.navigate(navigateUrl);
  }
}
