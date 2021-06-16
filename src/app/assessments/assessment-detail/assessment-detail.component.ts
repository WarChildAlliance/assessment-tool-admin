import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from 'src/app/core/models/table-column.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-assessment-detail',
  templateUrl: './assessment-detail.component.html',
  styleUrls: ['./assessment-detail.component.scss']
})
export class AssessmentDetailComponent implements OnInit {

  public displayedColumns: TableColumn[] = [
    { key: 'name', name: 'Name' },
    { key: 'students_count', name: 'Number of students with active access' },
    { key: 'students_completed_count', name: 'Number of students with active access who completed it' },
    { key: 'overall_students_completed_count', name: 'Overall number of students who completed it' },
    { key: 'questions_count', name: 'Number of questions' }
  ];

  public topicsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  public isAssessmentPrivate = false;

  public selectedTopics: any[] = [];

  currentAssessment: any;

  @ViewChild('createTopicDialog') createTopicDialog: TemplateRef<any>;

  public createNewTopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const assessmentId = params.id;

      this.assessmentService.getAssessmentTopics(assessmentId).subscribe((topicsList) => {
        this.topicsDataSource = new MatTableDataSource(topicsList);
      });

      this.assessmentService.getAssessmentDetails(assessmentId).subscribe(assessment => {
        this.currentAssessment = assessment;
      });
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: any[]): void {
    this.selectedTopics = newSelection;
  }

  openCreateTopicDialog(): void {
    this.dialog.open(this.createTopicDialog);
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${this.currentAssessment.id}/topics/${id}`]);
  }
  /*
  deleteCurrentAssessment(): void {
    console.log('DELETE CURRENT ASSESSMENT');
  }
 */
  deleteSelection(): void {
    // TODO implement the proper deletion
    console.log('DEL', this.selectedTopics);
  }

  downloadData(): void {
    console.log('Work In Progress');
  }

  submitCreateNewTopic(): void {
    const topicToCreate = {
      name: this.createNewTopicForm.value.name,
      order: this.createNewTopicForm.value.order,
      assessment: this.currentAssessment.id
    };
    // TODO implement the proper creation of object
    console.log('NEW TOPIC: ', topicToCreate);
  }
}
