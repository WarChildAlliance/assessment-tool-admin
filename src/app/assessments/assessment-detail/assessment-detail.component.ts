import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment } from 'src/app/core/models/assessment.model';
import { Topic } from 'src/app/core/models/topic.models';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-assessment-detail',
  templateUrl: './assessment-detail.component.html',
  styleUrls: ['./assessment-detail.component.scss']
})
export class AssessmentDetailComponent implements OnInit {

  public displayedColumns: { key: string, value: string }[] = [
    { key: 'name', value: 'Name' },
    { key: 'order', value: 'Order' },
  ]

  public filterableColumns = ["name"];
  public topicsDataSource: MatTableDataSource<Topic> = new MatTableDataSource([]);

  public isAssessmentPrivate = false;

  public selectedTopics: Topic[] = [];

  currentAssessment: Assessment;

  @ViewChild('createTopicDialog') createTopicDialog: TemplateRef<any>;

  public createNewTopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
  });

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {

    const assessmentId = this.route.snapshot.paramMap.get('id');

    this.assessmentService.getAssessmentTopics(assessmentId).subscribe((topicsList) => {
      this.topicsDataSource = new MatTableDataSource(topicsList);
    });

    this.assessmentService.getAssessmentDetails(assessmentId).subscribe(assessment => {
      this.currentAssessment = assessment;
    });
  }

  // This eventReceiver triggers a thousand times when user does "select all". We should find a way to improve this. (debouncer ?)
  onSelectionChange(newSelection: Topic[]) {
    this.selectedTopics = newSelection;
  }

  openCreateTopicDialog(): void {
    this.dialog.open(this.createTopicDialog);
  }

  onOpenDetails(id: string): void {
    this.router.navigate([`/assessments/${this.currentAssessment.id}/topics/${id}`]);
  }

  deleteSelection(): void {
    // TODO implement the proper deletion
    console.log('DEL', this.selectedTopics);
  }

  downloadData(): void {
    console.log('Work In Progress');
  };

  submitCreateNewTopic(): void {
    const topicToCreate = {
      name: this.createNewTopicForm.value.name,
      order: this.createNewTopicForm.value.order,
      assessment: this.currentAssessment
    };
    // TODO implement the proper creation of object
    console.log('NEW TOPIC: ', topicToCreate);
  }
}
