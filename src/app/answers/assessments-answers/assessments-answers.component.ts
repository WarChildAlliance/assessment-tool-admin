import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-assessments-answers',
  templateUrl: './assessments-answers.component.html',
  styleUrls: ['./assessments-answers.component.scss']
})
export class AssessmentsAnswersComponent implements OnInit {

  assessmentsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  currentStudentId: string;
  sessionId: string;

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'title', value: 'Title' },
    { key: 'subject', value: 'Subject' },
    { key: 'accessible_topics_count', value: 'Number of topics accessible by the student' },
    { key: 'completed_topics_count', value: 'Number of topics completed by the student' },
    { key: 'language_name', value: 'Language' },
    { key: 'country_name', value: 'Country' },
  ];

  public searchableColumns = ['title', 'language', 'subject'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    this.currentStudentId = this.route.snapshot.paramMap.get('student_id');
    this.sessionId = this.route.snapshot.paramMap.get('student_id');
    // TODO Use the sessionId

    this.answerService.getStudentAssessments(this.currentStudentId).subscribe(assessments => {
      this.assessmentsAnswersDataSource = new MatTableDataSource(assessments)
    });
  }

  onOpenDetails(assessmentId: string): void {
    this.router.navigate([`students/${this.currentStudentId}/assessments/${assessmentId}/topics`]);
  }
}
