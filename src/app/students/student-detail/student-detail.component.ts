import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import { TopicAccessModalComponent } from '../topic-access-modal/topic-access-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
})
export class StudentDetailComponent implements OnInit {
  public student: StudentTableData;
  public studentAssessments: any[];
  public assessment: any;
  public deletable = false;

  constructor(
    private userService: UserService,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.getStudentDetails(params.student_id);
      this.getStudentAssessments(params.student_id);
    });
  }

  private getStudentDetails(studentId): void {
    this.userService
      .getStudentDetails(studentId.toString()).subscribe((student) => {
        this.student = student;
        this.deletable = this.student.can_delete;
    });
  }

  private getStudentAssessments(studentId): void {
    this.assessmentService.getStudentAssessments(studentId).subscribe(
      (assessments) => {
        assessments.forEach((assessment) => {
          assessment.topic_access.forEach((topic) => {
            topic.hasAccess = moment(
              formatDate(new Date(), 'yyyy-MM-dd', 'en')
            ).isBetween(topic.start_date, topic.end_date, null, '[]');
          });
        });
        this.studentAssessments = assessments;
    });
  }

  public onEdit(): void {
    const editStudentDialog = this.dialog.open(StudentDialogComponent, {
      data: {
        student: this.student
      }
    });

    editStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentDetails(this.student.id);
      }
    });
  }

  public editTopicsAccesses(assessment): void {
    this.assessment = assessment;
    const editAssignTopicDialog = this.dialog.open(TopicAccessModalComponent, {
      data: {
        assessment: [this.assessment],
        studentId: this.student.id
      }
    });

    editAssignTopicDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentAssessments(this.student.id);
      }
    });
  }

  public onDelete(): void {
    const confirmDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('students.deleteStudent'),
        content: this.translateService.instant('students.deleteStudentPrompt'),
        contentType: 'innerHTML',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe(res => {
      if (res) {
        this.userService.deleteStudent(this.student.id.toString()).subscribe(() => {
          this.alertService.success(
            this.translateService.instant(
              'students.studentDeleteSuccess',
              { fullname: this.student.full_name, username: this.student.username }
          ));

          this.router.navigate(['students']);
        });
      }
    });
  }
}
