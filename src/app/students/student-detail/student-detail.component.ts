import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
})
export class StudentDetailComponent implements OnInit {
  public student: StudentTableData;
  public studentAssessments;

  @ViewChild('editStudentDialog') editStudentDialog: TemplateRef<any>;

  constructor(
    private userService: UserService,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService
        .getStudentDetails(params.student_id)
        .subscribe((student) => {
          this.student = student;
          this.assessmentService
            .getStudentAssessments(this.student.id)
            .subscribe((assessments) => {
              assessments.forEach((assessment) => {
                assessment.topic_access.forEach((topic) => {
                  topic.hasAccess = moment(
                    formatDate(new Date(), 'yyyy-MM-dd', 'en')
                  ).isBetween(topic.start_date, topic.end_date, null, '[]');
                });
              });
              this.studentAssessments = assessments;
            });
        });
    });
  }

  editCurrentStudent(): void {
    const editStudentDialog = this.dialog.open(this.editStudentDialog);
    editStudentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.userService
          .getStudentDetails(this.student.id.toString())
          .subscribe((student) => {
            this.student = student;
          });
      }
    });
  }

  deleteCurrentStudent(): void {
    console.log('DELETE CURRENT USER');
  }
}
