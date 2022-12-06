import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { QuestionTableData } from 'src/app/core/models/question-table-data.model';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  public assessmentId: string;
  public topicId: string;

  public displayedColumns: TableColumn[] = [
    { key: 'title', name: 'assessments.questionsList.questionName' },
    { key: 'expand', name: ' ', type: 'expand' },
    { key: 'learning_objective', name: 'general.id' },
    { key: 'plays', name: 'assessments.plays' },
    { key: 'invites', name: 'library.invites' },
    { key: 'speed', name: 'groups.speed', type: 'duration' },
    { key: 'score', name: 'library.score', type: 'score' },
    { key: 'created_at', name: 'general.created', type: 'date' },
  ];

  public questionsDataSource: MatTableDataSource<QuestionTableData> = new MatTableDataSource([]);
  public selectedQuestions: any[] = [];
  public questionDetails: any;
  public showQuestionPreview = false;
  public previousPageUrl = '';

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.displayedColumns.forEach(col => {
      this.translateService.stream(col.name).subscribe(translated => col.name = translated);
    });
  }

  ngOnInit(): void {
    const idUrl = this.route.snapshot.paramMap.get('topic_id') || '';
    this.previousPageUrl = this.router.url.replace(`topics/${idUrl}`, '');
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.assessmentId = params.get('assessment_id');
        this.topicId = params.get('topic_id');

        return this.assessmentService.getTopicQuestions(this.assessmentId, this.topicId);
      })
    ).subscribe((questionsList) => {
      questionsList.forEach(question => {
        question.learning_objective = question.learning_objective.name_eng;
      });
      this.questionsDataSource = new MatTableDataSource(questionsList);
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  public onSelectionChange(newSelection: any[]): void {
    this.selectedQuestions = newSelection;
  }

  public onOpenDetails(id: string): void {
    // this.router.navigate([`/assessments/${this.assessmentId}/topics/${this.topicId}/questions/${id}`]);
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }

  // For preview button (not being used)
  public onPreviewQuestion(element: any): void {
    this.assessmentService.getQuestionDetails(this.assessmentId, this.topicId, element.id).subscribe(details => {
      this.questionDetails = details;
      this.showQuestionPreview = true;
    });
  }
}
