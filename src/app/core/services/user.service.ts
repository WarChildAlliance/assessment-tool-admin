import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // If at some point we need to programmatically get the current studentsList value,
  // we could change Subject to BehaviorSubject and destroy the subscriptions on
  // component's ngDestroy to avoid subscripting multiple times
  private studentsListSource: Subject<User[]> = new Subject();

  public studentsList = this.studentsListSource.asObservable();

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) {}

  getSelf(): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/get_self/`);
  }

  getStudentsList(): void {
    this.http.get<User[]>(`${environment.API_URL}/users/`).subscribe(res => {
      this.studentsListSource.next(res);
    });
  }

  getStudentDetails(id: string): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/${id}`);
  }

  createNewStudent(user: { first_name: string, last_name: string, role: string, language: string, country: string }): void {
    this.http.post(`${environment.API_URL}/users/`, user).subscribe(res => {
      this.alertService.success(`Student ${res['first_name'] + ' ' + res['last_name']} with ID ${res['username']} was successfully created`);
    });
    this.getStudentsList();
  }
}
