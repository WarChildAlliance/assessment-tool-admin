import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentTableData } from 'src/app/core/models/student-table-data.model';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  public student: StudentTableData;
  public studentAssessments;

  constructor(
    private userService: UserService,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.userService.getStudentDetails(params.student_id).subscribe(student => {
        this.student = student;
        this.assessmentService.getStudentAssessments(this.student.id).subscribe(assessments => {
          assessments.forEach(assessment => {
            assessment.topic_access.forEach(topic => {
              topic.hasAccess = moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')).isBetween(topic.start_date, topic.end_date);
            });
          });
          this.studentAssessments = assessments;
        });
      });
    });
  }

  deleteCurrentStudent(): void {
    console.log('DELETE CURRENT USER');
  }
}
