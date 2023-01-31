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

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'Title' },
    { key: 'question_type', name: 'Question type' },
  ];

  public searchableColumns = ['title', 'question_type'];

  public questionsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public selectedQuestions: any[] = [];

  private assessmentId: string = this.route.snapshot.paramMap.get('assessment_id');
  private questionSetId: string = this.route.snapshot.paramMap.get('question_set_id');

  constructor(private assessmentService: AssessmentService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.assessmentService.getQuestionSetQuestions(this.assessmentId, this.questionSetId).subscribe((questionsList) => {
      this.questionsDataSource = new MatTableDataSource(questionsList);
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  public onSelectionChange(newSelection: any[]): void {
    this.selectedQuestions = newSelection;
  }

  public onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${this.assessmentId}/question-sets/${this.questionSetId}/questions/${id}`]);
  }

  public deleteSelection(): void {
    console.log('DEL', this.selectedQuestions);
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }
}
