import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from 'src/app/core/models/answer.model';
import { AnswerService } from 'src/app/core/services/answer.service';

@Component({
  selector: 'app-assessments-answers',
  templateUrl: './assessments-answers.component.html',
  styleUrls: ['./assessments-answers.component.scss']
})
export class AssessmentsAnswersComponent implements OnInit {

  assessmentsAnswersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'title', value: 'Title' },
    { key: 'language', value: 'Language' },
    { key: 'subject', value: 'Subject' },
    { key: 'topics_count', value: 'Number of topics' },
  ];

  public searchableColumns = ['title', 'language', 'subject'];

  constructor(private router: Router, private route: ActivatedRoute, private answerService: AnswerService) { }

  ngOnInit(): void {
    this.answerService.getStudentAssessments(this.route.snapshot.paramMap.get('id')).subscribe(assessments => {
      this.assessmentsAnswersDataSource = new MatTableDataSource(JSON.parse(assessments));
      console.log(assessments);
    });
  }

  onOpenDetails(id: string): void {
    // this.router.navigate([`/students/${id}`]);
  }
}
