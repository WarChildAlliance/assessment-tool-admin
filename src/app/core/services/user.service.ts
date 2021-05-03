import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BatchTopicAccesses } from '../models/batch-topic-accesses.model';
import { User } from '../models/user.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  newUser: User;

  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService
  ) { }

  getSelf(): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/get_self/`);
  }

  getStudentsList(filteringOptions?: object): Observable<User[]> {
    const initialUrl = `${environment.API_URL}/users/`;
    const finalUrl = filteringOptions ? this.utilitiesService.urlBuilder(initialUrl, filteringOptions) : initialUrl;
    return this.http.get<User[]>(finalUrl);
  }

  getStudentDetails(id: string): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/${id}`);
  }

  createNewStudent(user: { first_name: string, last_name: string, role: string, language: string, country: string }): Observable<User> {
    return this.http.post<User>(`${environment.API_URL}/users/`, user);
  }

  assignTopicsAccesses(batch_topic_access: BatchTopicAccesses): Observable<BatchTopicAccesses> {
    return this.http.post<BatchTopicAccesses>(`${environment.API_URL}/assessments/never_gonna_give_you_up___never_gonna_let_you_down/accesses/bulk_create/`, batch_topic_access)
  }
}
