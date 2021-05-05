import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Answer } from 'src/app/core/models/answer.model';
import { User } from 'src/app/core/models/user.model';
import { AnswerService } from 'src/app/core/services/answer.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  student: User;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.userService.getStudentDetails(this.route.snapshot.paramMap.get('id')).subscribe(student => {
      this.student = student;
    });
  }

  deleteCurrentStudent(): void {
    console.log('DELETE CURRENT USER');
  }
}
