import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  newUser: User;

  constructor(
    private http: HttpClient
  ) {}

  getSelf(): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/get_self/`);
  }

  getStudentsList(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API_URL}/users/`)
  }

  getStudentDetails(id: string): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/${id}`);
  }

  createNewStudent(user: { first_name: string, last_name: string, role: string, language: string, country: string }): Observable<User> {
    return this.http.post<User>(`${environment.API_URL}/users/`, user);
  }
}
