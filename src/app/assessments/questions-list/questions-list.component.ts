import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/core/models/question.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  private assessmentId = this.route.snapshot.paramMap.get('assessment_id');
  private topicId = this.route.snapshot.paramMap.get('topic_id');

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'title', value: 'Title' },
    { key: 'question_type', value: 'Question type' },
  ];

  public searchableColumns = ['title', 'question_type'];

  public questionsDataSource: MatTableDataSource<Question> = new MatTableDataSource([]);
  public selectedQuestions: Question[] = [];

  @ViewChild('createQuestionDialog') createQuestionDialog: TemplateRef<any>;

  public createNewQuestionForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
  });

  constructor(private assessmentService: AssessmentService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {

    this.assessmentService.getTopicQuestions(this.assessmentId, this.topicId).subscribe((questionsList) => {
      this.questionsDataSource = new MatTableDataSource(questionsList);
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: Question[]): void {
    this.selectedQuestions = newSelection;
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${this.assessmentId}/topics/${this.topicId}/questions/${id}`]);
  }

  openCreateQuestionDialog(): void {
    this.dialog.open(this.createQuestionDialog);
  }

  deleteSelection(): void {
    console.log('DEL', this.selectedQuestions);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }
}
