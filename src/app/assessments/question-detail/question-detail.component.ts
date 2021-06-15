import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {

  private assessmentId = this.route.snapshot.paramMap.get('assessment_id');
  private topicId = this.route.snapshot.paramMap.get('topic_id');

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'question_type', name: 'Question type' },
  ];

  public searchableColumns = ['title', 'question_type'];

  public questionsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public selectedQuestions: any[] = [];
  bullshitTest: boolean = true;  

  constructor(private assessmentService: AssessmentService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    this.assessmentService.getTopicQuestions(this.assessmentId, this.topicId).subscribe((questionsList) => {
      this.questionsDataSource = new MatTableDataSource(questionsList);
    });
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
