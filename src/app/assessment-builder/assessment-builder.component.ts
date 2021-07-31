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
}
