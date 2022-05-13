import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateStudentDialogComponent } from '../create-student-dialog/create-student-dialog.component';
import { TopicAccessModalComponent } from '../topic-access-modal/topic-access-modal.component';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
})
export class StudentDetailComponent implements OnInit {
  public student: StudentTableData;
  public studentAssessments: any[];
  public assessment: any;

  constructor(
    private userService: UserService,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private dialog: MatDialog
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

  editCurrentStudent(): void {
    const editStudentDialog = this.dialog.open(CreateStudentDialogComponent, {
      data: {
        newStudent: this.student
      }
    });

    editStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getStudentDetails(this.student.id);
      }
    });
  }

  editTopicsAccesses(assessment): void {
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

  deleteCurrentStudent(): void {
    console.log('DELETE CURRENT USER');
  }
}
