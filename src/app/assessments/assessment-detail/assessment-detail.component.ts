import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Assessment } from 'src/app/core/models/assessment.model';
import { Topic } from 'src/app/core/models/topic.models';
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
  selector: 'app-assessment-detail',
  templateUrl: './assessment-detail.component.html',
  styleUrls: ['./assessment-detail.component.scss']
})
export class AssessmentDetailComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'order'];
  assessment: Assessment;
  topicsList: Topic[] = [];

  selection = new SelectionModel<Topic>(true, []);


  @ViewChild('createTopicDialog') createTopicDialog: TemplateRef<any>;

  createNewTopicForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    order: new FormControl('', [Validators.required]),
  });


  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.assessmentService.topicsList.pipe(first()).subscribe((newList) => {
      this.topicsList = newList;
    })

    this.assessmentService.getAssessmentDetails(this.route.snapshot.paramMap.get('id')).subscribe(res => {
      this.assessment = res;
      this.assessmentService.getAssessmentTopics(this.assessment.id.toString());
    });
  }


  openCreateTopicDialog() {
    this.dialog.open(this.createTopicDialog);
  }

  openTopicDetails(id: number) {
    this.router.navigate([`/assessments/${this.assessment.id}/topics/${id}`]);
  }

  deleteSelection() {
    // TODO implement the proper deletion
    console.log("DEL", this.selection.selected);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.topicsList.length;
  }
  
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.topicsList.forEach(row => this.selection.select(row));
  }

  onSubmit() {
    const topicToCreate = {
      name: this.createNewTopicForm.value.name,
      order: this.createNewTopicForm.value.order,
      assessment: this.assessment
    }
    // TODO implement the proper creation of object
    console.log('NEW TOPIC: ', topicToCreate);
  }
}
