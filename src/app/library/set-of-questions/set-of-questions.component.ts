import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-set-of-questions',
  templateUrl: './set-of-questions.component.html',
  styleUrls: ['./set-of-questions.component.scss']
})
export class SetOfQuestionsComponent implements OnInit {

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'general.name' },
    { key: 'students_count', name: 'assessments.assessmentDetail.activeAccessStudents' },
    { key: 'students_completed_count', name: 'assessments.assessmentDetail.activeAccessCompletedStudents' },
    { key: 'overall_students_completed_count', name: 'assessments.assessmentDetail.studentsCompleted' },
    { key: 'questions_count', name: 'general.questionsNumber' }
  ];

  public topicsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  public selectedTopics: any[] = [];

  public createNewTopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private assessmentService: AssessmentService,
    private translateService: TranslateService
  ) {
      this.displayedColumns.forEach(col => {
        this.translateService.stream(col.name).subscribe(translated => col.name = translated);
      });
    }

  ngOnInit(): void {
    this.assessmentService.getAssessmentTopicsList().subscribe((topicsList) => {
      this.topicsDataSource = new MatTableDataSource(topicsList);
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  public onSelectionChange(newSelection: any[]): void {
    this.selectedTopics = newSelection;
  }

  public downloadData(): void {
    console.log('Work In Progress');
  }
}
