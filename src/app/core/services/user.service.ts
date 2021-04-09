import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) {}

  getSelf(): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/get_self/`);
  }

  getStudentsList(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API_URL}/users/`);
  }

  createNewStudent(user): void {
    this.http.post(`${environment.API_URL}/users/`, user).subscribe(res => {
      this.alertService.success(`Student ${res['first_name'] + ' ' + res['last_name']} with ID ${res['username']} was successfully created`);
    });
  }
}
