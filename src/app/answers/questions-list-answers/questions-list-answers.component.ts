import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-questions-list-answers',
  templateUrl: './questions-list-answers.component.html',
  styleUrls: ['./questions-list-answers.component.scss']
})
export class QuestionsListAnswersComponent implements OnInit {

  questionsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  currentStudentId: string;
  assessmentId: string;
  topicId: string;
  sessionId: string;

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'question_type', value: 'Type of question' },
    { key: 'duration', value: 'Time spent by the student to answer' },
    { key: 'valid', value: 'Is the answer valid ?' }
  ];

  public searchableColumns = ['question_type', 'valid'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    this.currentStudentId = this.route.snapshot.paramMap.get('student_id');
    this.assessmentId = this.route.snapshot.paramMap.get('assessment_id');
    this.topicId = this.route.snapshot.paramMap.get('topic_id');
    this.sessionId = this.route.snapshot.paramMap.get('student_id');
    // TODO Use the sessionId

    this.answerService.getQuestionsAnwsers(this.currentStudentId, this.assessmentId, this.topicId).subscribe(questions => {
      console.log('Q', questions)
      this.questionsAnswersDataSource = new MatTableDataSource(questions)
    });
  }

  onOpenDetails(topicId: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments/${this.assessmentId}/topics/${topicId}/questions`]);
  }
}