import { Component, OnInit } from '@angular/core';
import { Assessment } from '../core/models/assessment.model';
import { AssessmentService } from '../core/services/assessment.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-assessment-builder',
  templateUrl: './assessment-builder.component.html',
  styleUrls: ['./assessment-builder.component.scss']
})
export class AssessmentBuilderComponent implements OnInit {

  public currentAssessments: Assessment[] = [];
  public currentTopics: any[] = [];
  public currentTopic = null;
  public currentQuestions: any[] = [];
  public currentQuestion = null;

  public editAssessment = false;
  public editTopic = false;
  public editInput = false;
  public editNumberLine = false;
  public editSelect = false;
  public editSort = false;


  constructor(
    private assessmentService: AssessmentService,
    public dialog: MatDialog,
    public alertService: AlertService
  ) { }


  ngOnInit(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.currentAssessments = assessmentsList;
    });
  }

  getAll(): void {
    this.assessmentService.getAllData().subscribe(res => {
      const testCSV = this.objToCsv(res);
      this.downloadBlob(testCSV, 'export.csv', 'text/csv;charset=utf-8;');
    });
  }

  objToCsv(arr): any {
    arr = [{student_id: 0, assessment_title: 'x', topic_name: 'x', question_id: 0, attempt: 0,
      valid: false, start_datetime: 0, end_datetime: 0, value1: 'x', value2: []}, ...arr];
    const array = [Object.keys(arr[0])].concat(arr);

    const test = array.map( (item: any) => {
      if (item.selected_options){
        item.value = '';
        item.selected_options = item.selected_options.map( i => i.value);
      }
      return Object.values(item).toString();
    }).join('\n');
    return test;
  }

  getCurrentTopics(assessmentId: number): void {
    this.assessmentService.getAssessmentTopics(assessmentId.toString()).subscribe((topicsList) => {
      this.currentTopics = topicsList;
    });
  }

  getTopicDetails(assessmentId: number, topicId: number): void {
    this.assessmentService.getTopicDetails(assessmentId.toString(), topicId.toString()).subscribe((topic) => {
      this.currentTopic = topic;
    });
  }

  getCurrentQuestions(assessmentId: number, topicId: number): void {
    this.getTopicDetails(assessmentId, topicId);
    this.assessmentService.getTopicQuestions(assessmentId.toString(), topicId.toString()).subscribe((questionsList) => {
      this.currentQuestions = questionsList;
    });
  }

  getQuestionDetails(assessmentId: number, topicId: number, questionId: number): void {
    this.assessmentService.getQuestionDetails(assessmentId, topicId, questionId).subscribe((question) => {
      this.currentQuestion = question;
    });
  }

  deleteAssessment(assessmentId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data: {
          confirmationText: 'Are you sure you want to delete this assessment?',
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.assessmentService.deleteAssessment(assessmentId.toString()).subscribe((assessment) => {
          this.alertService.success('Successfully deleted assessment');
        });
      }
    });
  }

  deleteTopic(assessmentId: number, topicId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data: {
          confirmationText: 'Are you sure you want to delete this topic?',
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.assessmentService.deleteTopic(assessmentId.toString(), topicId.toString()).subscribe((topic) => {
          this.alertService.success('Successfully deleted topic');
        });
      }
    });
  }

  deleteQuestion(assessmentId: number, topicId: number, questionId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      disableClose: true,
      data: {
          confirmationText: 'Are you sure you want to delete this question?',
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.assessmentService.deleteQuestion(assessmentId.toString(), topicId.toString(), questionId.toString()).subscribe((question) => {
          this.alertService.success('Successfully deleted question');
        });
      }
    });
  }

  edit(type): void {
    switch (type) {
      case 'assessment':
        this.editAssessment = !this.editAssessment;
        break;
      case 'topic':
        this.editTopic = !this.editTopic;
        break;
      case 'Input':
        this.editInput = !this.editInput;
        break;
      case 'Number line':
        this.editNumberLine = !this.editNumberLine;
        break;
      case 'Select':
        this.editSelect = !this.editSelect;
        break;
      case 'Sort':
        this.editSort = !this.editSort;
        break;
      default:
        break;
    }
  }

  getCount(assessment: any): number {
    return assessment.topics_count;
  }

  downloadBlob(content, filename, contentType): void {
    // Create a blob
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Create a link to download it
    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  }
}
